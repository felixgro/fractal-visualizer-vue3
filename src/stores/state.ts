import { defineStore } from 'pinia';

export const useState = defineStore('state', {
    state: () => ({
    } as { [key: string]: any }),
});