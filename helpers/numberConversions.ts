import { EulerAngles, Quaternion } from "../types";

export const convertMillisToSeconds = (millis: number) => millis / 1000;
export const convertSecondsToMillis = (seconds: number) => seconds * 1000;
export const degreesToRadians = (degrees: number) => degrees * Math.PI / 180;
export const radiansToDegrees = (radians: number) => radians * 180 / Math.PI;
