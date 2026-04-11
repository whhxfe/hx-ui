import { Hono } from "hono";
import {
  selectOptions,
  selectGroupOptions,
  cascaderOptions,
  getLinkedOptions,
  genderOptions,
  ethnicityOptions,
  getHubeiLinkedOptions,
} from "../data/mock-data";

const app = new Hono();

// Select Remote Options
app.get("/options/select", (c) => {
  const search = c.req.query("search");
  if (search) {
    const filtered = selectOptions.filter((o) =>
      o.label.includes(search)
    );
    return c.json({ code: 0, data: filtered });
  }
  return c.json({ code: 0, data: selectOptions });
});

app.post("/options/select", async (c) => {
  const body = await c.req.json();
  if (body.search) {
    const filtered = selectOptions.filter((o) =>
      o.label.includes(body.search)
    );
    return c.json({ code: 0, data: filtered });
  }
  return c.json({ code: 0, data: selectOptions });
});

// Select Group Remote Options
app.get("/options/select-group", (c) => {
  const groups = [
    { label: "热门城市", options: selectOptions.slice(0, 4) },
    { label: "其他城市", options: selectOptions.slice(4) },
  ];
  return c.json({ code: 0, data: groups });
});

app.post("/options/select-group", async (c) => {
  const groups = [
    { label: "热门城市", options: selectOptions.slice(0, 4) },
    { label: "其他城市", options: selectOptions.slice(4) },
  ];
  return c.json({ code: 0, data: groups });
});

// Cascader Remote Options
app.get("/options/cascader", (c) => {
  return c.json({ code: 0, data: cascaderOptions });
});

app.post("/options/cascader", async (c) => {
  return c.json({ code: 0, data: cascaderOptions });
});

// ============================================================
// filter-panel 联动接口 — 省 / 市 / 区 三级
// parent 参数传值规则：
//   空 / 'all'        → 该层级默认全部选项（如：市列表不筛选）
//   <省value>         → 该省下的市列表
//   <市value>         → 该市下的区列表
// ============================================================
app.get("/options/linked", (c) => {
  const parent = c.req.query("parent");
  return c.json({ code: 0, data: getLinkedOptions(parent) });
});

app.post("/options/linked", async (c) => {
  const body = await c.req.json();
  return c.json({ code: 0, data: getLinkedOptions(body?.parent) });
});

// ============================================================
// 性别选项
// ============================================================
app.get("/options/gender", (c) => {
  return c.json({ code: 0, data: genderOptions });
});

// ============================================================
// 民族选项（56个民族）
// ============================================================
app.get("/options/ethnicity", (c) => {
  return c.json({ code: 0, data: ethnicityOptions });
});

// ============================================================
// 湖北省市区二级联动接口
// parent 参数：
//   'province'    → 返回省列表（仅湖北省）
//   <市value>     → 返回该市下的区/县列表
//   空 / 'all'    → 返回全部市列表
// ============================================================
app.get("/options/hubei-linked", (c) => {
  const parent = c.req.query("parent");
  return c.json({ code: 0, data: getHubeiLinkedOptions(parent) });
});

app.post("/options/hubei-linked", async (c) => {
  const body = await c.req.json();
  return c.json({ code: 0, data: getHubeiLinkedOptions(body?.parent) });
});

export default app;
