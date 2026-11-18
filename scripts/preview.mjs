import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
const root = path.resolve("build");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".xml": "application/xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
};
http
  .createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      let target = path.resolve(root, "." + pathname);
      if (!target.startsWith(root + path.sep) && target !== root) {
        response.writeHead(403);
        response.end();
        return;
      }
      let status = 200;
      try {
        if ((await stat(target)).isDirectory())
          target = path.join(target, "index.html");
        await stat(target);
      } catch {
        target = path.join(root, "404.html");
        status = 404;
      }
      const content = await readFile(target);
      response.writeHead(status, {
        "Content-Type":
          types[path.extname(target)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(content);
    } catch {
      if (!response.headersSent)
        response.writeHead(503, { "Retry-After": "1" });
      response.end("Preview is rebuilding. Refresh in a moment.");
    }
  })
  .listen(5173, "127.0.0.1", () =>
    console.log("Archive preview: http://127.0.0.1:5173"),
  );
