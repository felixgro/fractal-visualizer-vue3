export default class Prng {
    private _seed: number = 0;

    get seed(): number {
        return this._seed;
    }

    set seed(seed: number) {
        this._seed = seed;
    }

    // generates random number between 0 and 1
    // mulberry32: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    public next(): number {
        let t = (this._seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    // generates random boolean value with given probability
    public chance = (probability = 0.5): boolean => {
        return this.next() < probability;
    };

    // generates random integer in range [0, max]
    // if negative is true the range changes to [-max, max]
    public range = (max: number, negative = false): number => {
        const r = this.next() * max;
        return negative && this.chance() ? -r : r;
    }
}