import type { APIRoute } from 'astro';

// 文件注册表（内存存储，Serverless 环境下重启会丢失）
// 生产环境建议使用云存储（如 Vercel Blob、S3 等）
const fileRegistry = new Map<string, {
  fileName: string;
  name: string;
  size: number;
  mimeType: string;
}>();

export const GET: APIRoute = async ({ url }) => {
  const pathname = url.pathname;
  const parts = pathname.split('/');
  const fileId = parts[parts.length - 1];

  const meta = fileRegistry.get(fileId);

  if (!meta) {
    return new Response(JSON.stringify({ code: 404, message: '文件不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      code: 0,
      data: {
        id: fileId,
        url: `/uploads/${meta.fileName}`,
        name: meta.name,
        size: meta.size,
        mimeType: meta.mimeType,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  const pathname = new URL(request.url).pathname;

  // 处理多文件上传
  if (pathname.endsWith('/upload/multiple')) {
    try {
      const formData = await request.formData();
      const files = formData.getAll('files') as File[];

      if (!files.length) {
        return new Response(JSON.stringify({ code: 400, message: '未找到上传文件' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const results = files.map((file) => {
        const fileId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const fileName = `${Date.now()}-${file.name}`;

        fileRegistry.set(fileId, {
          fileName,
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
        });

        return {
          id: fileId,
          url: `/uploads/${fileName}`,
          name: file.name,
          size: file.size,
        };
      });

      return new Response(JSON.stringify({ code: 0, data: results }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ code: 500, message: '上传失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 处理单文件上传
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ code: 400, message: '未找到上传文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const fileName = `${Date.now()}-${file.name}`;

    fileRegistry.set(fileId, {
      fileName,
      name: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
    });

    return new Response(
      JSON.stringify({
        code: 0,
        data: {
          id: fileId,
          url: `/uploads/${fileName}`,
          name: file.name,
          size: file.size,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ code: 500, message: '上传失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  const pathname = url.pathname;
  const parts = pathname.split('/');
  const fileId = parts[parts.length - 1];

  if (!fileRegistry.has(fileId)) {
    return new Response(JSON.stringify({ code: 404, message: '文件不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  fileRegistry.delete(fileId);

  return new Response(JSON.stringify({ code: 0, message: '删除成功' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
