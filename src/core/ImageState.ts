import { reactive } from 'vue';

const state = reactive({
    width: 100,
    height: 100,
    format: 'image/png'
});

export default { state };