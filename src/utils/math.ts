export const isFloat = (num: number) => {
    return Number.isFinite(num) && num % 1 !== 0;
}