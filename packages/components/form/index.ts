import { withInstall } from "../../utils/install"
import _Form from "./Form.vue"

export const HxForm = withInstall(_Form, "hx-form")
export default HxForm

export { HxSelect } from "../select"
export type { SelectProps } from "../select"
export { HxRadio } from "../radio"
export type { RadioProps } from "../radio"
export { HxCheckbox } from "../checkbox"
export type { CheckboxProps } from "../checkbox"

export type {
	FormExpose,
	FormField,
	FieldType,
	OptionItem,
	GroupOptionItem,
	RemoteConfig,
	FormProps,
	FormFieldProps,
	FormFieldEmits,
} from "./types"

// ← 向后兼容别名（将在下一个大版本中移除）
/** @deprecated 请使用 FormField 代替 */
export type { FormField as FormColumn } from "./types"
