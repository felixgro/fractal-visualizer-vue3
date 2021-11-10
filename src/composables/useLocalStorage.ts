import { ref } from 'vue';

const useLocalStorage = <T>(key: string, defaultValue?: T) => {
    const value = ref<T>();

    const setValue = (newValue: T) => {
        localStorage.setItem(key, JSON.stringify(newValue));
        value.value = newValue;
    };

    const getValue = () => {
        const stringValue = localStorage.getItem(key);

        if (stringValue) {
            value.value = JSON.parse(stringValue);
        } else if (defaultValue) {
            setValue(defaultValue);
        }
    };

    getValue();

    return { value, setValue };
}

export default useLocalStorage;