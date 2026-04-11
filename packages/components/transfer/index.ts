import { withInstall } from "../../utils/install"
import _Transfer from "./Transfer.vue"

export const HxTransfer = withInstall(_Transfer, "hx-transfer")
export default HxTransfer

export type { TransferOption, TransferGroup, TransferRemoteConfig } from "./types"