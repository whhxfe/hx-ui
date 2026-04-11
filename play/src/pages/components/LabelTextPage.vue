<template>
  <div class="page-container">
    <h1 class="page-title">LabelText 标签文本</h1>
    <p class="page-desc">用于展示标签和文本的左右布局，常用于表单详情页、数据展示等场景。</p>

    <!-- 基础用法 -->
    <section class="demo-section">
      <h3 class="section-title">基础用法</h3>
      <p class="section-desc">使用 <code>label</code> 和 <code>text</code> 属性展示简单的标签文本。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-label-text label="姓名" text="张三" />
        </div>
        <div class="demo-row">
          <hx-label-text label="邮箱" text="zhangsan@example.com" />
        </div>
        <div class="demo-row">
          <hx-label-text label="手机" text="138****8888" />
        </div>
      </div>
    </section>

    <!-- 尺寸 -->
    <section class="demo-section">
      <h3 class="section-title">尺寸</h3>
      <p class="section-desc">通过 <code>size</code> 属性设置尺寸大小。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-label-text label="Small" text="小尺寸文本" size="small" />
        </div>
        <div class="demo-row">
          <hx-label-text label="Default" text="默认尺寸文本" />
        </div>
        <div class="demo-row">
          <hx-label-text label="Large" text="大尺寸文本" size="large" />
        </div>
      </div>
    </section>

    <!-- 固定宽度 -->
    <section class="demo-section">
      <h3 class="section-title">固定宽度</h3>
      <p class="section-desc">通过 <code>label-width</code> 设置标签宽度。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-label-text label="固定100px" text="宽度100像素" :label-width="100" />
        </div>
        <div class="demo-row">
          <hx-label-text label="固定120px居中" text="宽度120像素，标签居中" :label-width="120" label-align="center" />
        </div>
        <div class="demo-row">
          <hx-label-text label="百分比" text="宽度50%" label-width="50%" />
        </div>
      </div>
    </section>

    <!-- 文本行数限制 -->
    <section class="demo-section">
      <h3 class="section-title">文本行数限制</h3>
      <p class="section-desc">通过 <code>text-line</code> 限制文本显示行数，超出部分省略。</p>
      <div class="demo-block" style="width: 300px;">
        <div class="demo-row">
          <hx-label-text label="不限制" text="这是一段较长的文本，不限制行数，可以完整显示所有内容" />
        </div>
        <div class="demo-row">
          <hx-label-text label="限制1行" text="这是一段较长的文本，超出1行会被截断显示省略号" :text-line="1" />
        </div>
        <div class="demo-row">
          <hx-label-text label="限制2行" text="这是一段较长的文本，超出2行会被截断显示省略号，这是一段较长的文本" :text-line="2" />
        </div>
        <div class="demo-row">
          <hx-label-text label="限制3行" text="这是一段较长的文本，超出3行会被截断显示省略号，这是一段较长的文本，超出3行会被截断显示省略号，这是一段较长的文本" :text-line="3" />
        </div>
      </div>
    </section>

    <!-- 自定义对齐 -->
    <section class="demo-section">
      <h3 class="section-title">自定义对齐</h3>
      <p class="section-desc">通过 <code>align</code> 和 <code>label-align</code> 设置对齐方式。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-label-text label="垂直居中" text="默认居中对齐" align="center" />
        </div>
        <div class="demo-row">
          <hx-label-text label="顶部对齐" text="内容与标签顶部对齐" align="start" />
        </div>
        <div class="demo-row">
          <hx-label-text label="底部对齐" text="内容与标签底部对齐" align="end" />
        </div>
        <div class="demo-row">
          <hx-label-text label="固定宽度" text="带对齐的固定宽度示例" :label-width="100" label-align="right" />
        </div>
      </div>
    </section>

    <!-- 插槽使用 -->
    <section class="demo-section">
      <h3 class="section-title">插槽使用</h3>
      <p class="section-desc">使用默认插槽自定义文本内容。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-label-text label="富文本" text="使用插槽插入自定义内容">
            <span class="text-red-500">红色</span>和<span class="text-blue-500">蓝色</span>文本
          </hx-label-text>
        </div>
        <div class="demo-row">
          <hx-label-text label="带图标" text="带图标的内容">
            <hx-icon type="iconify" name="ep:check" class="text-green-500 mr-1" />
            操作成功
          </hx-label-text>
        </div>
        <div class="demo-row">
          <hx-label-text label="HTML内容" text="支持HTML内容">
            <a href="#" class="text-blue-500 hover:underline">点击链接</a>
          </hx-label-text>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 900px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.section-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.section-desc code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #c7254e;
}

.demo-block {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
}

.demo-row {
  margin-bottom: 12px;
}

.demo-row:last-child {
  margin-bottom: 0;
}
</style>
