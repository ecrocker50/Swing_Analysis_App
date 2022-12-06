import { UserSessionsData } from "../../types";


export const userDataMock: UserSessionsData = [
    {
        sessionName: "session0",
        mode: "Backhand",
        handedness: 'Right',
        calibratedQuaternion: {real: 0, i: 0, j: 0, k: 0},
        swings: [
            {
                contactSpeed: 11.54,
                points: [
                    {
                        time: 0,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 1,
                        quaternion: {real: 0.2, i: 0.2, j: 0.2, k: 0.2},
                        position: {x: 2, y: 2, z: 2}
                    },
                    {
                        time: 3,
                        quaternion: {real: 0.3, i: 0.3, j: 0.3, k: 0.3},
                        position: {x: 3, y: 3, z: 3}
                    },
                    {
                        time: 5,
                        quaternion: {real: 0.4, i: 0.4, j: 0.4, k: 0.4},
                        position: {x: 4, y: 4, z: 4}
                    },
                    {
                        time: 6,
                        quaternion: {real: 0.5, i: 0.5, j: 0.5, k: 0.5},
                        position: {x: 5, y: 5, z: 5}
                    },
                    {
                        time: 8,
                        quaternion: {real: 0.6, i: 0.6, j: 0.6, k: 0.6},
                        position: {x: 6, y: 6, z: 6}
                    },
                    {
                        time: 11,
                        quaternion: {real: 0.7, i: 0.7, j: 0.7, k: 0.7},
                        position: {x: 7, y: 7, z: 7}
                    },
                    {
                        time: 13,
                        quaternion: {real: 0.8, i: 0.8, j: 0.8, k: 0.8},
                        position: {x: 8, y: 8, z: 8}
                    },
                ],
                timeOfContact: 8
            },
            {
                contactSpeed: 12,
                points: [
                    {
                        time: 0,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 1,
                        quaternion: {real: 0.2, i: 0.2, j: 0.2, k: 0.2},
                        position: {x: 2, y: 2, z: 2}
                    },
                    {
                        time: 2,
                        quaternion: {real: 0.3, i: 0.3, j: 0.3, k: 0.3},
                        position: {x: 3, y: 3, z: 3}
                    },
                    {
                        time: 3,
                        quaternion: {real: 0.4, i: 0.4, j: 0.4, k: 0.4},
                        position: {x: 4, y: 4, z: 4}
                    },
                    {
                        time: 6,
                        quaternion: {real: 0.5, i: 0.5, j: 0.5, k: 0.5},
                        position: {x: 5, y: 5, z: 5}
                    },
                    {
                        time: 7,
                        quaternion: {real: 0.6, i: 0.6, j: 0.6, k: 0.6},
                        position: {x: 6, y: 6, z: 6}
                    },
                    {
                        time: 8,
                        quaternion: {real: 0.7, i: 0.7, j: 0.7, k: 0.7},
                        position: {x: 7, y: 7, z: 7}
                    },
                    {
                        time: 9,
                        quaternion: {real: 0.8, i: 0.8, j: 0.8, k: 0.8},
                        position: {x: 8, y: 8, z: 8}
                    },
                ],
                timeOfContact: 6
            }
        ]
    }
];