import { withInstall } from "../../utils/install"
import _Select from "./Select.vue"

export const HxSelect = withInstall(_Select, "hx-select")
export default HxSelect

export type { SelectProps } from "./types"
