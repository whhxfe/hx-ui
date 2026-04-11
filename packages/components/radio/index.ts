import { withInstall } from "../../utils/install"
import _Radio from "./Radio.vue"

export const HxRadio = withInstall(_Radio, "hx-radio")
export default HxRadio

export type { RadioProps } from "./types"
