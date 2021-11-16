import type { Emitter } from '@/plugins/emitter';
import { getCurrentInstance } from 'vue';

export default (): Emitter => {
    const internalAppInstance = getCurrentInstance();
    const emitter = internalAppInstance?.appContext.config.globalProperties.$emitter;
    return (emitter as Emitter);
}