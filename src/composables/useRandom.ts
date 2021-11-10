import { ref } from 'vue';

interface RandomOptions {
    seed?: number;
}

interface Random {
    setSeed: (newSeed: number) => void;
    next: () => number;
    chance: (percent: number) => boolean;
    range: (max: number, negative?: boolean) => number;
}

const useRandom = (options?: RandomOptions): Random => {
    const seed = ref<number>(options?.seed ?? 0);
    const generator = ref<() => number>(mulberry32(seed.value));

    // defines a new seed and resets algorithm to it's initial state
    const setSeed = (newSeed: number): void => {
        seed.value = newSeed;
        generator.value = mulberry32(seed.value);
    }

    // generates random float in range [0, 1]
    const next = (): number => generator.value.call({});

    // generates random boolean value
    const chance = (percent: number): boolean => next() < percent;

    // generates random integer in range [0, max]
    // if negative is true the range changes to [-max, max]
    const range = (max: number, negative = false): number => {
        const rand = next() * max;
        return (negative && chance(0.5)) ? -rand : rand;
    }

    return {
        setSeed,
        next,
        chance,
        range
    }
}

export default useRandom;

// pseudo random number generator function mulberry32
// see: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a: number) {
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};