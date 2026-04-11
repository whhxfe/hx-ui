import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";
import optionsRouter from "./routes/options";
import uploadRouter from "./routes/upload";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

// 静态资源 - 文件预览
app.get("/files/*", serveStatic({ root: "./public" }));

// 图标静态资源
app.get("/icons/*", serveStatic({ root: "./public" }));

// 上传文件访问
app.get("/uploads/*", serveStatic({ root: "./public" }));

// API 路由
app.route("/api", optionsRouter);
app.route("/api", uploadRouter);

// 健康检查
app.get("/health", (c) => c.json({ code: 0, message: "ok" }));

// 启动服务
const port = 4300;
console.log(`Mock Server 运行在 http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
