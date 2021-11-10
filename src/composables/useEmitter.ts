import { getCurrentInstance } from 'vue';
import type { Emitter } from '@/plugins/emitter';

export default (): Emitter => {
    const internalAppInstance = getCurrentInstance();
    const emitter = internalAppInstance?.appContext.config.globalProperties.$emitter;
    return (emitter as Emitter);
}