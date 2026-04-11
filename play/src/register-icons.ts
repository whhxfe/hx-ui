import { addCollection } from '@iconify/vue/offline'
// import ep from '@iconify-json/ep/icons.json'
// import ep from '@iconify-json/ep/icons.json'
// import mdi from '@iconify-json/mdi/icons.json'
// import logos from '@iconify-json/logos/icons.json'

import ep from '@iconify/json/json/ep.json'
import mdi from '@iconify/json/json/mdi.json'
import logos from '@iconify/json/json/logos.json'
import streamlineLogos from '@iconify/json/json/streamline-logos.json'
import type { IconifyJSON } from '@iconify/types'

// 注册 Iconify 图标集（离线），使 <hx-icon type="iconify"> 可正常渲染
addCollection(ep as IconifyJSON)
addCollection(mdi as IconifyJSON)
addCollection(logos as IconifyJSON)
addCollection(streamlineLogos as IconifyJSON)
