import { ref, computed, onMounted, onBeforeMount } from 'vue';

// internal id count to prevent duplicate ids
let _id = 0;

const useUid = () => {
    // unique id for each component
    const uid = ref(_id);

    // generate unique id string for dom element within component
    const id = (label: string) => `${label}_${uid.value}`;

    // increment internal id for each component
    onBeforeMount(() => _id++);

    return { id, uid };
}

export default useUid;