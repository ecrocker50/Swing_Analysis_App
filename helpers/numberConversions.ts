import { EulerAngles, Quaternion } from "../types";

export const convertMillisToSeconds = (millis: number) => millis / 1000;
export const convertSecondsToMillis = (seconds: number) => seconds * 1000;
export const degreesToRadians = (degrees: number) => degrees * Math.PI / 180;
export const radiansToDegrees = (radians: number) => radians * 180 / Math.PI;


export const convertQuaternionToEuler = (quaternion: Quaternion): EulerAngles => {
    const t0 = 2.0 * (quaternion.real * quaternion.i + quaternion.j * quaternion.k);
    const t1 = 1.0 - 2.0 * (quaternion.i * quaternion.i + quaternion.j * quaternion.j);
    const roll = radiansToDegrees(Math.atan2(t0, t1));

    let t2 = 2.0 * (quaternion.real * quaternion.j - quaternion.k * quaternion.i);

    t2 = t2 > 1 ? 1.0 : t2;
    t2 = t2 < -1 ? -1.0 : t2;

    const pitch = radiansToDegrees(Math.asin(t2));

    const t3 = 2.0 * (quaternion.real * quaternion.k + quaternion.i * quaternion.j);
    const t4 = 1.0 - 2.0 * (quaternion.j * quaternion.j + quaternion.k * quaternion.k);

    const yaw = radiansToDegrees(Math.atan2(t3, t4));

    const eulerAngles: EulerAngles = { roll, pitch, yaw };

    return eulerAngles;
};