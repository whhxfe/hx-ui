<template>
  <HxUpload
    v-model="fileIds"
    action="/api/upload"
    :accept="accept"
    :limit="10"
    :multiple="true"
    :response-mapper="(res) => res.data.id"
    :preview-fetch-url="'/api/upload/preview'"
    :delete-fetch-url="'/api/upload'"
    :show-download="true"
    list-type="file-preview"
    placeholder="上传附件"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxUpload } from '@hx/ui'

const fileIds = ref<string[]>([])
const accept = '.jpg,.png,.gif,.pdf,.doc,.docx,.mp4'
</script>
