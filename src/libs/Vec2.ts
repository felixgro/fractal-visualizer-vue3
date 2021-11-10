import Vec2Base from '@felixgro/vec2';

export default class Vec2 extends Vec2Base {
    public static degToRad(deg: number): number {
        return deg * Math.PI / 180;
    }
};