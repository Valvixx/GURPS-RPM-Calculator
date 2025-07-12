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

        bonusValue: 0,
        bonusType: '',
        bonusSubject: ''
    }),
    actions: {
    }
})
