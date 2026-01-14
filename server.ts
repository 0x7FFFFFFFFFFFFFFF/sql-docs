import { serve, file } from "bun";
import { join, dirname, resolve, relative } from "path";
import { marked } from "marked";

const PORT = 8642;
const ROOT_DIR = process.cwd();

// Helper: Handle DocFX style paths (e.g., ~/folder/file.md)
function resolveDocFxPath(currentFilePath: string, linkPath: string): string {
    // Handle Root-relative paths (starting with ~/)
    if (linkPath.startsWith("~/")) {
        return join(ROOT_DIR, linkPath.substring(2));
    }
    // Handle standard relative paths
    return resolve(dirname(currentFilePath), linkPath);
}

// Helper: Recursively process MS-Specific Markdown
async function processMarkdown(filePath: string, visited: Set<string> = new Set()): Promise<string> {
    // A. CIRCULAR DEPENDENCY CHECK
    if (visited.has(filePath)) {
        return `> *[System: Circular Dependency Detected - ${relative(ROOT_DIR, filePath)}]*`;
    }

    const newVisited = new Set(visited);
    newVisited.add(filePath);

    const fileRef = file(filePath);
    if (!(await fileRef.exists())) {
        return `> *[System: File Not Found - ${relative(ROOT_DIR, filePath)}]*`;
    }

    let content = await fileRef.text();

    // B. STRIP YAML FRONT MATTER
    // DocFX usually strips frontmatter from included files.
    if (content.startsWith("---")) {
        content = content.replace(/^---\s*[\s\S]*?---\s*/, '');
    }

    // C. TRIM CONTENT (!!!)
    // Included files often have trailing newlines. If included inside a table cell,
    // the newline breaks the table structure. We trim to ensure inline compatibility.
    content = content.trim();

    // D. HANDLE INCLUDES
    // Matches: [!include[title](path)] or [!INCLUDE [title](path)]
    // We use a specific regex to capture the title and the path.
    // Regex explanation:
    // \[!include    -> Literal start
    // [-+]?         -> Optional + or -
    // \s*           -> Optional whitespace
    // \[            -> Literal [ for title
    // (.*?)         -> Capture Title
    // \]            -> Literal ] for title
    // \(            -> Literal ( for path
    // (.*?)         -> Capture Path
    // \)            -> Literal ) for path
    // \]?           -> Optional closing ] (DocFX syntax varies slightly, this covers most)
    const includeRegex = /\[!include[-+]?\s*\[(.*?)\]\((.*?)\)\]?/gi;

    const replacements: { match: string; replacement: string }[] = [];
    let match;

    while ((match = includeRegex.exec(content)) !== null) {
        const rawMatch = match[0];
        const relativeLink = match[2].trim();

        // Resolve the absolute path of the included file
        const absoluteIncludePath = resolveDocFxPath(filePath, relativeLink);

        try {
            // RECURSION: Process the included file
            let includeContent = await processMarkdown(absoluteIncludePath, newVisited);

            // OPTIONAL: Fix relative image paths in the included content
            // If /folder/a.md includes /folder/sub/b.md, and b.md has ![](img.png),
            // we need to rewrite it to ![](sub/img.png).
            const dirOfParent = dirname(filePath);
            const dirOfChild = dirname(absoluteIncludePath);

            if (dirOfParent !== dirOfChild) {
                includeContent = includeContent.replace(/!\[(.*?)\]\((.*?)\)/g, (imgMatch, alt, imgPath) => {
                    if (imgPath.startsWith("http") || imgPath.startsWith("/")) return imgMatch;
                    const absoluteImgPath = resolve(dirOfChild, imgPath);
                    const relativeToParent = relative(dirOfParent, absoluteImgPath).replace(/\\/g, "/");
                    return `![${alt}](${relativeToParent})`;
                });

                // Also fix :::image source="...":::
                includeContent = includeContent.replace(/:::image\s+[^:]*?source="(.*?)"[^:]*?:::/g, (imgMatch, src) => {
                    if (src.startsWith("http") || src.startsWith("/")) return imgMatch;
                    const absoluteImgPath = resolve(dirOfChild, src);
                    const relativeToParent = relative(dirOfParent, absoluteImgPath).replace(/\\/g, "/");
                    // We rewrite it to standard markdown image for simplicity in the next step
                    return `![](${relativeToParent})`;
                });
            }

            replacements.push({ match: rawMatch, replacement: includeContent });
        } catch (e) {
            replacements.push({ match: rawMatch, replacement: `> *[System: Error processing include - ${relativeLink}]*` });
        }
    }

    // Apply replacements
    for (const rep of replacements) {
        content = content.replace(rep.match, rep.replacement);
    }

    // E. HANDLE IMAGES (Standardize MS custom image tag)
    // Matches: :::image type="icon" source="../../path.svg" border="false":::
    // Note: We already partially handled this in the include loop for path fixing, 
    // but this handles images in the current file.
    content = content.replace(/:::image\s+[^:]*?source="(.*?)"[^:]*?:::/g, (match, src) => {
        return `![](${src})`;
    });

    // F. HANDLE ALERTS (Convert to standard blockquotes for preview)
    content = content.replace(/>\s*\[!NOTE\]/gi, '> **Note**<br>');
    content = content.replace(/>\s*\[!TIP\]/gi, '> **Tip**<br>');
    content = content.replace(/>\s*\[!IMPORTANT\]/gi, '> **Important**<br>');
    content = content.replace(/>\s*\[!CAUTION\]/gi, '> **Caution**<br>');
    content = content.replace(/>\s*\[!WARNING\]/gi, '> **Warning**<br>');

    return content;
}

console.log(`Starting SQL Docs Server on http://localhost:${PORT}`);

serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);
        let pathname = url.pathname;

        // Decode URI components
        pathname = decodeURIComponent(pathname);

        // Default to index if root
        if (pathname === "/") pathname = "/index.yml"; // Try YML index first for docs
        if (pathname === "/" || pathname.endsWith("/")) pathname += "index.md";

        // Handle clean URLs
        let filePath = join(ROOT_DIR, pathname);
        let fileRef = file(filePath);

        if (!pathname.includes(".") && !(await fileRef.exists())) {
            filePath = join(ROOT_DIR, pathname + ".md");
            fileRef = file(filePath);
        }

        // If it's a Markdown file, render it as HTML
        if (filePath.toLowerCase().endsWith(".md")) {
            if (!(await fileRef.exists())) return new Response("Not Found", { status: 404 });

            // Start processing
            const processedContent = await processMarkdown(filePath);

            // Convert Markdown to HTML
            const htmlContent = marked.parse(processedContent);

            const htmlWrapper = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Doc Preview</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.2.0/github-markdown.min.css">
          <style>
            body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px; }
            .markdown-body { box-sizing: border-box; }
            /* Styling for the alerts */
            blockquote { background: #f8f9fa; border-left: 4px solid #dfe2e5; color: #6a737d; padding: 1em; }
            img { max-width: 100%; }
          </style>
        </head>
        <body class="markdown-body">
          ${htmlContent}
        </body>
        </html>
      `;

            return new Response(htmlWrapper, {
                headers: { "Content-Type": "text/html" },
            });
        }

        // Serve static assets
        if (await fileRef.exists()) {
            return new Response(fileRef);
        }

        return new Response(`Not Found: ${pathname}`, { status: 404 });
    },
});
