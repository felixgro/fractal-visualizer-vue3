import { reactive } from 'vue';

const ImageState = {
    state: reactive({
        bg: '#ffffff',
        fd: '#000000',
        lw: 1,
        export: {
            width: 100,
            height: 100,
            format: 'image/png'
        }
    }),
}

export default ImageState;