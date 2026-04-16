import { Hono } from "hono";
import { writeFile, mkdir, unlink, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const app = new Hono();

type FileMeta = { fileName: string; path: string; name: string; size: number; mimeType: string };
type RegistryData = Record<string, FileMeta>;

// 文件元信息注册表（内存 + 持久化）
const fileRegistry = new Map<string, FileMeta>();

const REGISTRY_FILE = join(process.cwd(), "registry.json");

// 启动时加载注册表
async function loadRegistry() {
  if (!existsSync(REGISTRY_FILE)) return;
  try {
    const content = await readFile(REGISTRY_FILE, "utf-8");
    const data: RegistryData = JSON.parse(content);
    for (const [id, meta] of Object.entries(data)) {
      fileRegistry.set(id, meta);
    }
  } catch (err) {
    console.error("[upload] 加载 registry 失败:", err);
  }
}

// 每次增删时持久化
async function saveRegistry() {
  const data: RegistryData = Object.fromEntries(fileRegistry);
  await writeFile(REGISTRY_FILE, JSON.stringify(data, null, 2), "utf-8");
}

loadRegistry();

// 单文件上传
app.post("/upload", async (c) => {
  const form = await c.req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return c.json({ code: 400, message: "未找到上传文件" }, 400);
  }

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const fileId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  fileRegistry.set(fileId, {
    fileName,
    path: filePath,
    name: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
  });
  await saveRegistry();

  return c.json({
    code: 0,
    data: {
      id: fileId,
      url: `/uploads/${fileName}`,
      name: file.name,
      size: file.size,
    },
  });
});

// 根据 fileId 获取文件访问 URL
app.get("/upload/:id", (c) => {
  const fileId = c.req.param("id");
  const meta = fileRegistry.get(fileId);

  if (!meta) {
    return c.json({ code: 404, message: "文件不存在" }, 404);
  }

  return c.json({
    code: 0,
    data: {
      id: fileId,
      url: `/uploads/${meta.fileName}`,
      name: meta.name,
      size: meta.size,
      mimeType: meta.mimeType,
    },
  });
});

// 根据 fileId 直接返回文件 URL（用于 img src 等场景）
app.get("/upload/preview/:id", (c) => {
  const fileId = c.req.param("id");
  const meta = fileRegistry.get(fileId);

  if (!meta) {
    return c.json({ code: 404, message: "文件不存在" }, 404);
  }

  return c.json({
    code: 0,
    data: {
      id: fileId,
      url: `/uploads/${meta.fileName}`,
      name: meta.name,
      size: meta.size,
      mimeType: meta.mimeType,
    },
  });
});

// 多文件上传
app.post("/upload/multiple", async (c) => {
  const form = await c.req.formData();
  const files = form.getAll("files") as File[];

  if (!files.length) {
    return c.json({ code: 400, message: "未找到上传文件" }, 400);
  }

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const results = await Promise.all(
    files.map(async (file) => {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      const fileId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      fileRegistry.set(fileId, {
        fileName,
        path: filePath,
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
      });

      return {
        id: fileId,
        url: `/uploads/${fileName}`,
        name: file.name,
        size: file.size,
      };
    })
  );
  await saveRegistry();

  return c.json({ code: 0, data: results });
});

// 根据 fileId 删除文件
app.delete("/upload/:id", async (c) => {
  const fileId = c.req.param("id");
  const meta = fileRegistry.get(fileId);

  if (!meta) {
    return c.json({ code: 404, message: "文件不存在" }, 404);
  }

  try {
    await unlink(meta.path);
  } catch {
    // 文件可能已被删除，静默忽略
  }

  fileRegistry.delete(fileId);
  await saveRegistry();
  return c.json({ code: 0, message: "删除成功" });
});

export default app;
