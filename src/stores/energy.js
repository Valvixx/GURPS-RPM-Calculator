// src/stores/energy.js
import { defineStore } from 'pinia'

export const useEnergyStore = defineStore('energy', {
    state: () => ({
        duration: 0,
        weight: 0,
        distance: 0,
        longDistance: 0,
        summoned: 0,
    }),
    actions: {
        setDuration(value) {
            this.duration = value
        }
    }
})
