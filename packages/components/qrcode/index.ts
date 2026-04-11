import { withInstall } from '../../utils/install'
import _QrCode from './QrCode.vue'

export const HxQrCode = withInstall(_QrCode, 'HxQrCode')
export default HxQrCode

export type {
  QrCodeProps,
  QrCodeRenderMode,
  QrCodeErrorCorrectionLevel,
  QrCodeLogo,
} from './types'