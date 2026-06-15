<template>
  <div class="demo-section">
    <p class="demo-label">基础用法</p>
    <div class="demo-column">
      <HxContentText content="这是一段普通的文本内容，没有截断也没有复制按钮，适用于简单的文本展示场景。" />
    </div>

    <p class="demo-label">自定义内容（插槽）</p>
    <div class="demo-column">
      <HxContentText>
        通过插槽传递内容，支持 HTML 结构。
        <span style="color: var(--hx-primary-color, #1890ff)">带样式的文本</span>
        也可以正常渲染。
      </HxContentText>
    </div>

    <p class="demo-label">禁用复制</p>
    <div class="demo-column">
      <HxContentText :copyable="false" content="设置 copyable=false 可隐藏复制按钮，适用于只读展示场景。" />
    </div>

    <p class="demo-label">无内容时占位</p>
    <div class="demo-column">
      <HxContentText placeholder="暂无数据" />
    </div>

    <p class="demo-label">行数截断（line=2）</p>
    <div class="demo-column">
      <div class="demo-fixed-width">
        <HxContentText
          :line="2"
          content="这是一段超出两行的文本内容，通过 line 属性限制最大显示行数。超出指定行数的部分会以省略号收尾，并出现「展开」按钮供用户查看完整内容。这是一段超出两行的文本内容，通过 line 属性限制最大显示行数。超出指定行数的部分会以省略号收尾，并出现「展开」按钮供用户查看完整内容。"
        />
      </div>
    </div>

    <p class="demo-label">行数截断（line=3）</p>
    <div class="demo-column">
      <div class="demo-fixed-width">
        <HxContentText
          :line="3"
          content="这是一段超出三行的文本内容，通过 line 属性限制最大显示行数。超出指定行数的部分会以省略号收尾，并出现「展开」按钮供用户查看完整内容。这是一段超出三行的文本内容，通过 line 属性限制最大显示行数。超出指定行数的部分会以省略号收尾，并出现「展开」按钮供用户查看完整内容。这是一段超出三行的文本内容，通过 line 属性限制最大显示行数。超出指定行数的部分会以省略号收尾，并出现「展开」按钮供用户查看完整内容。"
        />
      </div>
    </div>

    <p class="demo-label">自定义最大高度（120px 滚动）</p>
    <div class="demo-column">
      <div class="demo-fixed-width">
        <HxContentText
          :max-height="120"
          content="这是一段超出 120px 高度的文本内容，通过 max-height 属性限制最大高度。超出最大高度后会出现滚动条，用户可滚动查看所有内容。这是一段超出 120px 高度的文本内容，通过 max-height 属性限制最大高度。超出最大高度后会出现滚动条，用户可滚动查看所有内容。这是一段超出 120px 高度的文本内容，通过 max-height 属性限制最大高度。超出最大高度后会出现滚动条，用户可滚动查看所有内容。这是一段超出 120px 高度的文本内容，通过 max-height 属性限制最大高度。超出最大高度后会出现滚动条，用户可滚动查看所有内容。这是一段超出 120px 高度的文本内容，通过 max-height 属性限制最大高度。超出最大高度后会出现滚动条，用户可滚动查看所有内容。"
        />
      </div>
    </div>

    <p class="demo-label">长文本 — 行截断 + 复制</p>
    <div class="demo-column">
      <div class="demo-fixed-width">
        <HxContentText
          :line="2"
          content="这是一段同时使用了行截断和复制按钮的长文本。hover 到文本上时右上角会出现复制按钮，点击即可复制内容到剪贴板。同时文本截断后提供「展开/收起」交互。这是一段同时使用了行截断和复制按钮的长文本。hover 到文本上时右上角会出现复制按钮，点击即可复制内容到剪贴板。同时文本截断后提供「展开/收起」交互。"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxContentText } from '@whhx/ui'
</script>

<style scoped>
.demo-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.demo-label {
  margin: 0;
  font-size: 13px;
  color: #8a92a6;
  font-weight: 500;
}
.demo-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-fixed-width {
  width: 360px;
  max-width: 100%;
}
</style>