import { withInstall } from "../../utils/install"
import _DatePicker from "./DatePicker.vue"

export const HxDatePicker = withInstall(_DatePicker, "hx-date-picker")
export default HxDatePicker

export type { DatePickerProps, DatePickerType, DateRangeShortcut } from "./types"
