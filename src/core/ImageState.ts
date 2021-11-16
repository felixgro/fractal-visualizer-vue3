import { reactive } from 'vue';

const state = reactive({
    width: 100,
    height: 100,
    format: 'image/png'
});

const methods = {
    setDimensions(width: number, height: number) {
        state.width = width;
        state.height = height;
    }
};

export default { state, methods };