import type { InjectionKey, Slots } from 'vue'

/** provide/inject key: HxTable injects user slots into TableColumnItem */
export const TABLE_SLOTS_KEY: InjectionKey<Slots> = Symbol('HxTableSlots')
