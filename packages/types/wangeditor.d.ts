declare module "@wangeditor/editor" {
  export type IDomEditor = import("@wangeditor/core").IDomEditor
  export type IEditorConfig = import("@wangeditor/core").IEditorConfig
  export type IToolbarConfig = import("@wangeditor/core").IToolbarConfig
  export { Boot, createEditor, createToolbar } from "@wangeditor/editor/dist/editor/src"
}

declare module "@wangeditor/editor-for-vue" {
  import type { DefineComponent } from "vue"
  const Editor: DefineComponent<Record<string, any>>
  const Toolbar: DefineComponent<Record<string, any>>
  export { Editor, Toolbar }
}
