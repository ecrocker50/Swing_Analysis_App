import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
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


export function test(time: any, quaternion: Quaternion) {
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
        style={{ width: '30%', height: '30%' }}
        onTouchMove={event => {console.log(event)}}
        onContextCreate={async (gl) => {
            console.log(time)
            var scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.01, 1000);

            gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight }
            camera.position.set(0, 0, 25);

            const renderer = new Renderer({ gl })
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)


            const racketObj = await loadObjAsync({
                asset: require('../assets/Models/racket.obj'),
            });

            racketObj.scale.set(0.2, 0.2, 0.2)
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

export function ThreeDTwo() {

  let timeout: any;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);


  return (
    <GLView
      style={{ flex: 1, width: '90%', height: '90%' }}
      onContextCreate={async (gl) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 668096;

        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(0x668096);

        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(2, 5, 5);

        const scene = new Scene();
        scene.fog = new Fog(sceneColor, 1, 10000);

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        scene.add(pointLight);

        const spotLight = new SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);
    
        const asset = Asset.fromModule(require("../assets/Models/box.obj"));
        await asset.downloadAsync();

        // instantiate a loader
        const loader = new OBJLoader();

        // load a resource
        loader.load(
            // resource URL
            asset.localUri,
            // called when resource is loaded
            function ( object: any ) {
                object.scale.set(0.065, 0.065, 0.065)
                scene.add( object );
                camera.lookAt(object.position)
            //rotate my obj file
                function rotateObject(object: any, degreeX=0, degreeY=0, degreeZ=0) {
                    object.rotateX(THREE.Math.degToRad(degreeX));
                    object.rotateY(THREE.Math.degToRad(degreeY));
                    object.rotateZ(THREE.Math.degToRad(degreeZ));
                 }
                 
                 // usage:
                 rotateObject(object, 0, 0, 70);

                //animate rotation
                function update() {
                    object.rotation.x += 0.015
                }
                const render = () => {
                    timeout = requestAnimationFrame(render);
                    update();
                    renderer.render(scene, camera);
                    gl.endFrameEXP();
                  };
                render();
            },
           
            // called when loading is in progresses
            function ( xhr: any ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error: any ) {

                console.log( error );

            }
        
        );   
      }}
    />
  );  
}