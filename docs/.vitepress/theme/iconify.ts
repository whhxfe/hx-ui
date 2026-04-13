import { addCollection  } from '@iconify/vue/offline'
import ep from '@iconify/json/json/ep.json'
import mdi from '@iconify/json/json/mdi.json'
import logos from '@iconify/json/json/logos.json'
import streamlineLogos from '@iconify/json/json/streamline-logos.json'
import twemoji from '@iconify/json/json/twemoji.json'

import type { IconifyJSON } from '@iconify/types'

addCollection(ep as IconifyJSON)
addCollection(mdi as IconifyJSON)
addCollection(logos as IconifyJSON)
addCollection(streamlineLogos as IconifyJSON)
addCollection(twemoji as IconifyJSON)