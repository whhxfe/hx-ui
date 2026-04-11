import type { InjectionKey, Slots } from 'vue'

/** provide/inject key: HxForm injects user slots into FormField */
export const FORM_SLOTS_KEY: InjectionKey<Slots> = Symbol('HxFormSlots')
