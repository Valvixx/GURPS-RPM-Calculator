// src/stores/fields.js
import { defineStore } from 'pinia'

export const useFieldsStore = defineStore('fields', {
    state: () => ({
        durationValue: 0,
        durationType: 'minutes',

        weightValue: 0,
        weightType: 'lbs',

        distanceValue: 0,
        distanceType: 'yards',

        longDistanceValue: 0,
        longDistanceType: 'miles',

        summonedValue: 0,
        summonedType: 'summoned',

        spellBonuses: [],
        spellTraits: [],
        spellDamage: [],
        spellEffects: []
    }),

    actions: {
        // Добавляем метод для обновления spellBonuses
        setSpellBonuses(newBonuses) {
            this.spellBonuses = [...newBonuses]
        },
        setSpellTraits(newTraits) {
            this.spellTraits = [...newTraits]
        },
        setSpellDamage(newDamage) {
            this.spellDamage = [...newDamage]
        },
        setSpellEffects(newEffects) {
            this.spellEffects = [...newEffects]
        }
    },
})
