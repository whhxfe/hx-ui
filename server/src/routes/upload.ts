import { Hono } from "hono";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const app = new Hono();

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

  return c.json({
    code: 0,
    data: {
      url: `/uploads/${fileName}`,
      name: file.name,
      size: file.size,
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
      return {
        url: `/uploads/${fileName}`,
        name: file.name,
        size: file.size,
      };
    })
  );

  return c.json({ code: 0, data: results });
});

export default app;