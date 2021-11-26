import { ref, onBeforeMount } from 'vue';

// internal id count to prevent duplicate ids
let _id = 0;

export const useUid = () => {
    const uid = ref(_id);

    // generate unique id string for dom element within component
    const id = (label: string) => `${label}_${uid.value}`;

    onBeforeMount(() => _id++);

    return { id, uid };
}