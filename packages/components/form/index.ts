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
	FormColumn,
	FieldType,
	OptionItem,
	GroupOptionItem,
	RemoteConfig,
	FormProps,
	FormFieldProps,
	FormFieldEmits,
} from "./types"
