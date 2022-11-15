import { GLView } from 'expo-gl';
import { THREE, Renderer, loadObjAsync } from 'expo-three';
import * as React from 'react';
import {
  AmbientLight,
  Fog,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from 'three';
import { Quaternion } from '../types';


let obj: any = undefined;
let RENDERER: any = undefined;
let glGlobal: any = undefined;
let SCENE: any = undefined;
let CAMERA: any = undefined;


export function RacketOrientationDisplay(time: number, quaternion: Quaternion) {
    let timeout: any;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    const quaternionToSet = new THREE.Quaternion(quaternion.i, quaternion.j, quaternion.k, quaternion.real);

    if (obj !== undefined) {
        const euler = new THREE.Euler().setFromQuaternion(quaternionToSet);
        obj.rotation.x = euler.x;
        obj.rotation.y = euler.y;
        obj.rotation.z = euler.z;

        RENDERER.render(SCENE, CAMERA);
        glGlobal.endFrameEXP();
    }
  }, [time]);

  return (
    <GLView
        style={{ width: '95%', height: '50%', backgroundColor: 'white' }}
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

            racketObj.scale.set(0.32, 0.32, 0.32)
            scene.add(racketObj);
            camera.lookAt(racketObj.position)

            const quaternionToSet = new THREE.Quaternion(quaternion.i, quaternion.j, quaternion.k, quaternion.real);

            const euler = new THREE.Euler().setFromQuaternion(quaternionToSet);
            racketObj.rotation.x = euler.x;
            racketObj.rotation.y = euler.y;
            racketObj.rotation.z = euler.z;

            renderer.render(scene, camera);
            gl.endFrameEXP();
            SCENE = scene;
            CAMERA = camera;
            obj = racketObj;
            glGlobal = gl;
            RENDERER = renderer;
        }}
    />);
}