import { GLView } from 'expo-gl';
import { THREE, Renderer, loadObjAsync } from 'expo-three';
import * as React from 'react';
import { Mode, Quaternion } from '../types';
import { View } from './Themed';


let glob_obj: any = undefined;
let glob_renderer: any = undefined;
let glob_glRef: any = undefined;
let glob_scene: any = undefined;
let glob_camera: any = undefined;


export function RacketOrientationDisplay(time: number, quaternion: Quaternion, midPointEuler: any, isCalibrated: boolean, sessionMode: Mode) {
    let timeout: any;

  React.useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    const quaternionToSet = new THREE.Quaternion(quaternion.i, quaternion.j, quaternion.k, quaternion.real);

    if (glob_obj !== undefined) {

        const euler = new THREE.Euler().setFromQuaternion(quaternionToSet, 'XYZ');

        let zRot;
        
        // if (midPointEuler.z < 0) {
        //     // glob_obj.rotation.z = 6.28 + euler.z - midPointEuler.z;//euler.z - midPointEuler.z - 1.57;
        //     if (euler.z < 0) {
        //         zRot = ( euler.z - midPointEuler.z);
        //         // zRot = (midPointEuler.z - (6.28 + euler.z));
        //     } else {
        //         zRot = ((euler.z - 6.28) - midPointEuler.z);
        //         // zRot = ( euler.z - midPointEuler.z);
        //     }
        // } else {  
        //     if (euler.z < 0) {
        //         zRot = ((euler.z + 6.28) - midPointEuler.z);
        //         // zRot = (midPointEuler.z - euler.z);
        //     } else {
        //         // zRot = (midPointEuler.z - (euler.z - 6.28));
        //         zRot = (euler.z - midPointEuler.z);
        //     }
        // }

        // euler.z = zRot;

        // if (sessionMode === 'Serve') {
        //     euler.z -= 1.57;
        // }

        // euler.reorder('XYZ');

        // if (sessionMode === 'Serve') {
        //     euler.x += 3.14
        // } else if (sessionMode === 'Forehand') {
        //     euler.x += 1.57
        // } else {
        //     euler.x -= 1.57
        // }

        glob_obj.rotation.x = euler.x;
        glob_obj.rotation.y = euler.y;
        // glob_obj.rotation.z = euler.z - midPointEuler.z;
        glob_obj.rotation.z = euler.z;

        // if (midPointEuler.z < 0) {
        //     // glob_obj.rotation.z = 6.28 + euler.z - midPointEuler.z;//euler.z - midPointEuler.z - 1.57;
        //     if (euler.z < 0) {
        //         glob_obj.rotation.z = (midPointEuler.z - euler.z + 1.57);
        //     } else {
        //         glob_obj.rotation.z = (midPointEuler.z - (euler.z - 6.28) + 1.57);
        //     }
        // } else {  
        //     if (euler.z < 0) {
        //         glob_obj.rotation.z = (midPointEuler.z - (6.28 + euler.z) + 1.57);
        //     } else {
        //         glob_obj.rotation.z = ( euler.z - midPointEuler.z + 1.57);
        //     }
        // }
        // console.log(glob_obj.rotation.z);
        // if (isCalibrated) {
        //     glob_obj.rotation.z = euler.z;
        // } else {
        //     glob_obj.rotation.z = euler.z;
        // }
        // glob_camera.position.set(-1 * (Math.cos(midPointEuler.z) * 25), Math.sin(midPointEuler.z) * 25, 0);
        // glob_camera.lookAt(glob_obj.position)

        glob_renderer.render(glob_scene, glob_camera);
        glob_glRef.endFrameEXP();
    }
  }, [time]);

  return (
    <GLView
        style={{ width: '70%', height: 170, backgroundColor: 'white', alignSelf: 'center' }}
        onContextCreate={async (gl) => {
            var scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.01, 1000);

            gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight }
            camera.position.set(0, 0, 25);

            const renderer = new Renderer({ gl })
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)


            const racketObj = await loadObjAsync({
                asset: require('../assets/Models/racket_mid.obj'),
            });

            racketObj.scale.set(0.35, 0.35, 0.35)
            scene.add(racketObj);
            camera.lookAt(racketObj.position)
            

            const quaternionToSet = new THREE.Quaternion(quaternion.i, quaternion.j, quaternion.k, quaternion.real);

            const euler = new THREE.Euler().setFromQuaternion(quaternionToSet);
            racketObj.rotation.x = euler.x;
            racketObj.rotation.y = euler.y;
            if (isCalibrated) {
                racketObj.rotation.z = euler.z - midPointEuler.z;
            } else {
                racketObj.rotation.z = euler.z;
            }

            renderer.render(scene, camera);
            gl.endFrameEXP();

            glob_scene = scene;
            glob_camera = camera;
            glob_obj = racketObj;
            glob_glRef = gl;
            glob_renderer = renderer;
        }}
    />
    );
}