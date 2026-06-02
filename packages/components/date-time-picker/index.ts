import { withInstall } from "../../utils/install"
import _DateTimePicker from "./DateTimePicker.vue"

export const HxDateTimePicker = withInstall(_DateTimePicker, "hx-date-time-picker")
export default HxDateTimePicker

export type { DateTimePickerProps } from "./types"
