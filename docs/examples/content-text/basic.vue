<template>
  <div class="demo-section">
    <p class="demo-title">普通文本</p>
    <HxContentText :content="plainText" />

    <p class="demo-title" style="margin-top: 28px">行数截断（line=2）</p>
    <HxContentText :content="longText" :line="2" />

    <p class="demo-title" style="margin-top: 28px">行数截断（line=3）</p>
    <HxContentText :content="longText" :line="3" />

    <p class="demo-title" style="margin-top: 28px">自定义最大高度</p>
    <HxContentText :content="longText" :max-height="120" />
  </div>
</template>

<script setup lang="ts">
import { HxContentText } from '@whhx/ui'

const plainText = '这是一段普通的纯文本内容，无需任何特殊处理。'

const longText = `这是一段较长的文本内容，用于演示行数截断功能。
通过设置 line 属性，可以限制显示的行数。
当文本超过指定的行数时，超出部分会被隐藏，并显示「展开」按钮供用户点击查看完整内容。
第五行内容，用于验证多行场景下的截断效果。每一行的长度可能会不同，因此需要确保布局能够正确处理各种情况。这是一段较长的文本内容，用于演示行数截断功能。
通过设置 line 属性，可以限制显示的行数。
当文本超过指定的行数时，超出部分会被隐藏，并显示「展开」按钮供用户点击查看完整内容。
第五行内容，用于验证多行场景下的截断效果。每一行的长度可能会不同，因此需要确保布局能够正确处理各种情况。这是一段较长的文本内容，用于演示行数截断功能。
通过设置 line 属性，可以限制显示的行数。
当文本超过指定的行数时，超出部分会被隐藏，并显示「展开」按钮供用户点击查看完整内容。
第五行内容，用于验证多行场景下的截断效果。每一行的长度可能会不同，因此需要确保布局能够正确处理各种情况。`
</script>

<style scoped>
.demo-section {
  padding: 4px 0;
}
.demo-title {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}
</style>
