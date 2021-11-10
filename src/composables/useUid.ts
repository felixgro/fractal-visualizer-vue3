import { ref, computed, onMounted } from 'vue';

// internal id count to prevent duplicate ids
let __id__ = 0;

const useUID = () => {
    const id = ref(__id__);

    // unique id string for id assignments in dom
    const uid = computed(() => `uid_${id.value}`);

    // increment id for next component
    onMounted(() => __id__++);

    return { uid };
}

export default useUID;