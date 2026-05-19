import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      code: 0,
      message: 'hx-ui API Serverless Functions',
      endpoints: {
        options: {
          select: '/api/options/select',
          'select-group': '/api/options/select-group',
          cascader: '/api/options/cascader',
          linked: '/api/options/linked?parent=xxx',
          gender: '/api/options/gender',
          ethnicity: '/api/options/ethnicity',
          'hubei-linked': '/api/options/hubei-linked?parent=xxx',
        },
        upload: {
          single: '/api/upload',
          multiple: '/api/upload/multiple',
          get: '/api/upload/:id',
          delete: '/api/upload/:id',
        },
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
