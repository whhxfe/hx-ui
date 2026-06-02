import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * @type {import("eslint").Linter.FlatConfig[]}
 */
export default [
	// ============================================================
	// 1. 共享忽略
	// ============================================================
	{
		name: "hx-ui/shared-ignores",
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/dist-serve/**",
			"**/.vitepress/cache/**",
			"**/.vitepress/dist/**",
			"**/play/node_modules/**",
			"**/server/node_modules/**",
			"**/*.min.js",
			"**/*.min.css",
			".git/**",
		],
	},

	// ============================================================
	// 2. CommonJS 文件（.cjs）— 放在最前，避免被其他规则匹配
	// ============================================================
	{
		name: "hx-ui/cjs",
		files: ["**/*.cjs"],
		languageOptions: {
			sourceType: "commonjs",
		},
		rules: {
			"no-console": "off",
			"no-unused-vars": "off",
		},
	},

	// ============================================================
	// 3. TypeScript — packages 和 play 中的 .ts 文件
	// ============================================================
	{
		name: "hx-ui/typescript",
		files: ["packages/**/*.ts", "packages/**/*.d.ts", "play/src/**/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			...(tseslint.configs.recommendedTypeChecked.rules ?? {}),
			"@typescript-eslint/indent": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"no-console": ["warn", { allow: ["warn", "error"] }],
		},
	},

	// ============================================================
	// 4. Vue SFC — packages 中的组件（严格的业务代码）
	// ============================================================
	{
		name: "hx-ui/vue-packages",
		files: ["packages/**/*.vue"],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: [".vue"],
			},
			globals: {
				...globals.browser,
				...globals.es2025,
			},
		},
		plugins: {
			vue: vuePlugin,
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			...(vuePlugin.configs["flat/recommended"].rules ?? {}),
			"vue/html-closing-bracket-newline": "off",
			"vue/max-attributes-per-line": "off",
			"no-console": "off",
			"no-warning-comments": "off",
			...(tseslint.configs.recommendedTypeChecked.rules ?? {}),
			"@typescript-eslint/indent": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
		},
	},

	// ============================================================
	// 5. Vue SFC — play 中的示例页面（宽松规则）
	// ============================================================
	{
		name: "hx-ui/vue-play",
		files: ["play/src/**/*.vue"],
		ignores: [
			// vue-eslint-parser 对 <script lang="tsx"> 中 JSX 块的解析有已知限制
			"play/src/views/demos/map/demo/markers-cluster.vue",
			"play/src/views/demos/map/demo/markers-icon-url.vue",
		],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: [".vue"],
			},
			globals: {
				...globals.browser,
				...globals.es2025,
			},
		},
		plugins: {
			vue: vuePlugin,
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			...(vuePlugin.configs["flat/recommended"].rules ?? {}),
			"vue/max-attributes-per-line": "off",
			"no-console": "off",
			"no-warning-comments": "off",
			"@typescript-eslint/indent": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
		},
	},

	// ============================================================
	// 6. 通用 JS/TS 文件
	// ============================================================
	{
		name: "hx-ui/js",
		files: ["*.js", "play/src/main.ts", "play/src/router/**/*.ts", "play/src/views/**/*.ts"],
		ignores: ["play/node_modules/**", "**/*.cjs"],
		languageOptions: {
			parser: tseslint.parser,
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2025,
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			...(tseslint.configs.recommendedTypeChecked.rules ?? {}),
			"@typescript-eslint/indent": "off",
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-warning-comments": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
		},
	},

	// ============================================================
	// 7. Prettier — 关闭所有与 Prettier 冲突的 ESLint 格式化规则
	// 放在末尾，让其覆盖前面的同名规则
	// ============================================================
	{
		name: "hx-ui/prettier",
		rules: {
			...eslintConfigPrettier.rules,
			// prettier 不会处理 vue/indent 规则，所以需手动关闭
			"vue/html-indent": "off",
			"vue/script-indent": "off",
			"@typescript-eslint/indent": "off",
		},
	},
];
