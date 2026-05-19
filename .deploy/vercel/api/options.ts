import type { APIRoute } from 'astro';
import {
  selectOptions,
  cascaderOptions,
  getLinkedOptions,
  genderOptions,
  ethnicityOptions,
  getHubeiLinkedOptions,
} from '../../../server/src/data/mock-data';

export const GET: APIRoute = async ({ url }) => {
  const pathname = url.pathname;
  const search = url.searchParams.get('search');
  const parent = url.searchParams.get('parent');

  let data: unknown;

  if (pathname.endsWith('/options/select')) {
    if (search) {
      data = selectOptions.filter((o) => o.label.includes(search));
    } else {
      data = selectOptions;
    }
  } else if (pathname.endsWith('/options/select-group')) {
    data = [
      { label: '热门城市', options: selectOptions.slice(0, 4) },
      { label: '其他城市', options: selectOptions.slice(4) },
    ];
  } else if (pathname.endsWith('/options/cascader')) {
    data = cascaderOptions;
  } else if (pathname.endsWith('/options/linked')) {
    data = getLinkedOptions(parent || undefined);
  } else if (pathname.endsWith('/options/gender')) {
    data = genderOptions;
  } else if (pathname.endsWith('/options/ethnicity')) {
    data = ethnicityOptions;
  } else if (pathname.endsWith('/options/hubei-linked')) {
    data = getHubeiLinkedOptions(parent || undefined);
  } else {
    return new Response(JSON.stringify({ code: 404, message: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ code: 0, data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const pathname = new URL(request.url).pathname;

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // ignore parse errors
  }

  const search = body.search as string | undefined;
  const parent = body.parent as string | undefined;

  let data: unknown;

  if (pathname.endsWith('/options/select')) {
    if (search) {
      data = selectOptions.filter((o) => o.label.includes(search));
    } else {
      data = selectOptions;
    }
  } else if (pathname.endsWith('/options/select-group')) {
    data = [
      { label: '热门城市', options: selectOptions.slice(0, 4) },
      { label: '其他城市', options: selectOptions.slice(4) },
    ];
  } else if (pathname.endsWith('/options/cascader')) {
    data = cascaderOptions;
  } else if (pathname.endsWith('/options/linked')) {
    data = getLinkedOptions(parent);
  } else if (pathname.endsWith('/options/hubei-linked')) {
    data = getHubeiLinkedOptions(parent);
  } else {
    return new Response(JSON.stringify({ code: 404, message: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ code: 0, data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
