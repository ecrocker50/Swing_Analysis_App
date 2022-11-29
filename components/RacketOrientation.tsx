import { GLView } from 'expo-gl';
import { THREE, Renderer, loadObjAsync } from 'expo-three';
import * as React from 'react';
import { Quaternion } from '../types';
import { View } from './Themed';


let glob_obj: any = undefined;
let glob_renderer: any = undefined;
let glob_glRef: any = undefined;
let glob_scene: any = undefined;
let glob_camera: any = undefined;


export function RacketOrientationDisplay(time: number, quaternion: Quaternion) {
    let timeout: any;

  React.useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    const quaternionToSet = new THREE.Quaternion(quaternion.i, quaternion.j, quaternion.k, quaternion.real);

    if (glob_obj !== undefined) {
        const euler = new THREE.Euler().setFromQuaternion(quaternionToSet);
        glob_obj.rotation.x = euler.x - 1.57;
        glob_obj.rotation.y = euler.y;
        glob_obj.rotation.z = euler.z;

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
                asset: require('../assets/Models/racket.obj'),
            });

            racketObj.scale.set(0.35, 0.35, 0.35)
            scene.add(racketObj);
            camera.lookAt(racketObj.position)

            const quaternionToSet = new THREE.Quaternion(quaternion.i, quaternion.j, quaternion.k, quaternion.real);

            const euler = new THREE.Euler().setFromQuaternion(quaternionToSet);
            racketObj.rotation.x = euler.x;
            racketObj.rotation.y = euler.y;
            racketObj.rotation.z = euler.z;

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