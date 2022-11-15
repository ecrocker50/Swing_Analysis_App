import React, { Dispatch, useState } from 'react';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Platform } from 'react-native';
import { AnyAction } from '@reduxjs/toolkit';
import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { doesSessionHaveSwings, getMaxTimeOfSwing, getNumberOfSwingsInsideSession, getPosition, getQuaternion, getSwingsInsideSession, getTimeOfContact, getTimesOfAllPointsInSwing } from '../helpers/userDataMethods/userDataRead';
import {
    REDUCER_SET_CURRENT_TIME_IN_STORE,
    SELECTOR_CURRENT_TIME_SECONDS, 
} from '../store/timeSlice';
import {
    REDUCER_SET_SELECTED_SWING_IN_STORE,
    REDUCER_REMOVE_SWING_FROM_SESSION_IN_STORE,
    SELECTOR_SELECTED_SESSION,
    SELECTOR_USER_SESSIONS,
} from '../store/swingDataSlice';
import { UserSessionsData } from '../types';
import { convertQuaternionToEuler } from '../helpers/numberConversions';
import { Entypo } from '@expo/vector-icons';
import { GLView } from 'expo-gl';
import { ThreeDTwo } from './two';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { THREE, Renderer, loadObjAsync, loadTextureAsync } from 'expo-three';
import { Asset } from 'expo-asset';



export default function SwingVisualizeScreen() {
    const dispatch = useDispatch();
    
    const currentTimeSeconds   = useSelector(SELECTOR_CURRENT_TIME_SECONDS);
    const selectedSession = useSelector(SELECTOR_SELECTED_SESSION);
    const userSessions    = useSelector(SELECTOR_USER_SESSIONS);
    const [chosenSwing,   setChosenSwing]   = useState<number>(0);

    const quaternion  = getQuaternion(userSessions, selectedSession, chosenSwing, currentTimeSeconds);
    const position    = getPosition(userSessions, selectedSession, chosenSwing, currentTimeSeconds);
    const eulerAngles = convertQuaternionToEuler(quaternion);

    const [isDropDownOpen, setIsDropDownOpenOpen] = useState(false);
    const numOfSwings = getNumberOfSwingsInsideSession(userSessions, selectedSession);



    const onContextCreate = async (gl: any) => {
        // 1. Scene
        var scene = new THREE.Scene();
        // 2. Camera
        const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);

        gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight }
        camera.position.z = 1.5

        const renderer = new Renderer({ gl })
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)

        const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 'red' })

        // const cube = new THREE.Mesh(geometry, material)
        // scene.add(cube)

        // const loaderGltf = new GLTFLoader();
        // const model = Asset.fromModule(require('./box.gltf'));
        // await model.downloadAsync();
        // const loader = loaderGltf;
        // loader.load(
        //       model.uri || '', // .uri / .localUri will not work in release mode on android!
        //       result => { scene.add(model) },
        //       onLoad => {},
        //       onError => {},
        // );

        
        // const loader = new GLTFLoader();
        // const model = Asset.fromModule(require('./box.glb'));
        // loader.load(
        //     // resource URL
        //     model.uri,
        //     // called when the resource is loaded
        //     function ( gltf: any ) {
        //         console.log("adding to scene");
        //         scene.add( gltf.scene );
        
        //         gltf.animations; // Array<THREE.AnimationClip>
        //         gltf.scene; // THREE.Group
        //         gltf.scenes; // Array<THREE.Group>
        //         gltf.cameras; // Array<THREE.Camera>
        //         gltf.asset; // Object
        
        //     },
        //     // called while loading is progressing
        //     function ( xhr: any ) {
        
        //         console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
        //     },
        //     // called when loading has errors
        //     function ( error: any ) {
        
        //         console.log( 'An error happened' );
        //         console.log(error);
        //     }
        // );

        // const texture = await loadTextureAsync({
        //     asset: require('../assets/Models/textures.xpng'),
        // });
        // const texture = await loadTextureAsync({
        //     asset: require('../assets/Models/box.mtl')
        //   });
        const obj = await loadObjAsync({
            asset: require('../assets/Models/box.obj')
        });
          // to map texture to model (in case some newbie like me doesn't know how ><)
        obj.traverse(function(object) {
            if (object instanceof THREE.Mesh) {
                const material = new THREE.MeshBasicMaterial({ color: 'red' })
                object.materials.map = material;
            }
        });
        console.log("adding to scene")
        console.log(obj)
        scene.add(obj);

    


        // const loader = new OBJLoader();

        // loader.load( '../assets/Models/box.obj', function ( objs ) {

        //     scene.add( objs.scene );

        // }, undefined, function ( error ) {

        //     console.error( error );

        // } );

        const render = () => {
            requestAnimationFrame(render)
            // cube.rotation.x += 0.1
            // cube.rotation.y += 0.1
            // obj.rotation.y += 0.1
            renderer.render(scene, camera)
            gl.endFrameEXP()
        }

        render()
    };
    

    return (
        <View>
            <Text>Hello</Text>
            <GLView style={{width: '90%', height: '90%'}} onContextCreate={onContextCreate} ></GLView>
            {/* <ThreeDTwo /> */}
        </View>
    );


    if(chosenSwing !== -1)
    {
        const swingIndexMap = Array.apply(null, Array(numOfSwings)).map((val, index) => {return {label: index.toString(), value: index}});
        //console.log("delete")
        const allSwingTimePoints = getTimesOfAllPointsInSwing(userSessions, selectedSession, chosenSwing);
        const maxSwingValue = getMaxTimeOfSwing(userSessions, selectedSession, chosenSwing);
        const swings = getSwingsInsideSession(userSessions, selectedSession).length;
        return (
            <View style={styles.topContainer}>
                <Text style={styles.title}>Swing Visualization</Text>
                <View style={styles.lineUnderTitle}/>
                <View style={styles.space_medium} />
                
                <Text style={styles.title}>
                    Select a swing
                </Text>

                {/* <GLView style={{ width: 300, height: 300 }} onContextCreate={() => console.log("create")} /> */}
                {ThreeDTwo()}

                <DropDownPicker
                    open={isDropDownOpen}
                    value={chosenSwing}
                    items={swingIndexMap}
                    setOpen={setIsDropDownOpenOpen}
                    setValue={setChosenSwing}
                    searchable={true}
                    closeAfterSelecting={true}
                    closeOnBackPressed={true}
                    TickIconComponent={({style}: any) => <Entypo name='magnifying-glass' size={20} style={style} />}
                    style={{width: '60%', alignSelf: 'center'}}
                    textStyle={styles.normalText}
                    placeholderStyle={styles.normalText}
                    searchPlaceholder={"Search a Swing"}
                    searchTextInputStyle={styles.normalText}
                    dropDownContainerStyle={{width: '60%', alignSelf: 'center'}}
                    listItemLabelStyle={styles.normalText}
                    ListEmptyComponent={() => <View style={{height: 35}}><Text style={{...styles.normalText, marginTop: 4, fontStyle: 'italic'}}>No Data</Text></View>}
                    />

                {/* Use a light status bar on iOS to account for the black space above the modal */}
                <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

            
                <View style={styles.space_extra_large}/>

                <Text style={styles.title}>
                    Current Time: {currentTimeSeconds.toFixed(6)}s
                </Text>

                <Slider 
                    style={styles.slider} 
                    onValueChange={(value) => correctSliderValueAndSetStore(dispatch, value, allSwingTimePoints)}
                    maximumValue={maxSwingValue}
                    minimumValue={0}
                />

                <View style={styles.space_medium} />

                <View style={{flexDirection: 'row'}}>
                    <Button title="Prev" color='red'
                        onPress={() => {
                            if(chosenSwing > 0)
                            {
                                setChosenSwing(chosenSwing-1)
                                dispatch(REDUCER_SET_SELECTED_SWING_IN_STORE(chosenSwing));
                            }
                        }} />
                    <View style={styles.space_small} />
                    <Button title="Next" color='green' 
                        onPress={() => {
                            if(chosenSwing < getSwingsInsideSession(userSessions, selectedSession).length - 1)
                            {
                                setChosenSwing(chosenSwing+1);
                                dispatch(REDUCER_SET_SELECTED_SWING_IN_STORE(chosenSwing));
                            }
                        }} />
                </View>
                <View style={styles.space_small} />
                <Button 
                    color='red' 
                    title="Delete Swing" 
                    onPress={() => {
                        //console.log("button");
                        dispatch(REDUCER_REMOVE_SWING_FROM_SESSION_IN_STORE({sessionName: selectedSession, swingIndex: chosenSwing}));
                        //console.log("reducer");
                        //console.log(doesSessionHaveSwings(userSessions, selectedSession));
                        if(doesSessionHaveSwings(userSessions, selectedSession) === 1)
                        {
                            //console.log("-1");
                            setChosenSwing(-1);
                        }
                        else
                        {
                            if(chosenSwing === 0)
                            {
                                //console.log("0");
                                //console.log(chosenSwing);
                                setChosenSwing(chosenSwing);
                            }
                            else
                            {
                                //console.log("subtract");
                                setChosenSwing(chosenSwing-1);
                            }
                        }
                    }
                    }
                />

                <Text style={styles.normalText}>Session: {selectedSession}</Text>
                <Text style={styles.normalText}>Swing:   {chosenSwing}</Text>

                <Text style={styles.normalText}>Time of Contact: {getTimeOfContact(userSessions, selectedSession, chosenSwing)}s</Text>
                <Text style={styles.normalText}>Quaternion real:   {quaternion.real}</Text>
                <Text style={styles.normalText}>Quaternion i:   {quaternion.i}</Text>
                <Text style={styles.normalText}>Quaternion j:   {quaternion.j}</Text>
                <Text style={styles.normalText}>Quaternion k:   {quaternion.k}</Text>
                <Text style={styles.normalText}>Roll (degrees):    {eulerAngles.roll.toFixed(4)}</Text>
                <Text style={styles.normalText}>Pitch (degrees):   {eulerAngles.pitch.toFixed(4)}</Text>
                <Text style={styles.normalText}>Yaw (degrees):     {eulerAngles.yaw.toFixed(4)}</Text>
                <Text style={styles.normalText}>Position x:   {position.x}</Text>
                <Text style={styles.normalText}>Position y:   {position.y}</Text>
                <Text style={styles.normalText}>Position z:   {position.z}</Text>
            </View>
        );
    }
    else{
        return(
            <View style={styles.topContainer}>
            <Text style={styles.title}>Swing Visualization</Text>
            <View style={styles.lineUnderTitle}/>
            <View style={styles.space_medium} />
            <View style={styles.space_extra_large}/>
            <Text style={styles.normalText}> No Swings Found </Text>
            </View>
        );
    }
}


/** Corrects the raw slider value. Prevents the bug of it trying to find data for a time that we don't have any for
 * @example correctSliderValueAndSetStore(dispatch, 8, [1, 2, 3, 6, 9, 10, 15, 21, 23]);
 *          // This ^^^ sets currentTimeMilliseconds in the store
 *      Then, the time will be set to the next largest after the target, so in this case 9.
 * 
 * @param dispatch The dispatch hook
 * @param rawValue the raw value that the slider is set to
 * @param allSwingTimePoints An array of numbers that represent all points in time of the swing. THESE MUST BE IN ASCENDING ORDER
 */
 const correctSliderValueAndSetStore = (dispatch: Dispatch<AnyAction>, rawValue: number, allSwingTimePoints: Array<Number>) => {
    // Find the element that is the first one to be >= the raw value it tries to set to.
    // This ONLY works if allSwingTimePoints is in ascending order. 
    const element = allSwingTimePoints.find((time) => time >= rawValue);

    const newValue = element !== undefined ? element : rawValue

    dispatch(REDUCER_SET_CURRENT_TIME_IN_STORE(parseFloat(newValue.toFixed(6))));
};
