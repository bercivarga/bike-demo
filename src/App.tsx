import './App.css'
import {Canvas} from "@react-three/fiber";
import {Environment, Gltf, OrbitControls, PerspectiveCamera, useAnimations, useGLTF} from "@react-three/drei";
import {Vector3} from "three";
import {useCallback} from 'react';

// https://codesandbox.io/s/pecl6?file=/src/Model.js
// https://github.com/mrdoob/three.js/pull/13430
// https://sbcode.net/react-three-fiber/environment/
// https://polyhaven.com/hdris
// https://sketchfab.com/3d-models/carbon-frame-bike-398999b3360b4e6997a9aae253d6acbd

const modelPos = new Vector3(0, 0, 0)

const MAIN_ANIMATION_INDEX = 0;

const GLTF_PATH = "/models/carbon_frame_bike/scene.gltf";
const HDRI_PATH = "/hdris/fouriesburg_mountain_midday_2k.hdr";

function Model() {
    const {animations, scene} = useGLTF(GLTF_PATH);
    const {ref, actions, names} = useAnimations(animations, scene);


    const handleClick = useCallback(() => {
        const clip = actions[names[MAIN_ANIMATION_INDEX]];
        if (!clip) return;

        const playing = clip.isRunning();

        if (playing) {
            clip.stop();
            return;
        }

        clip.play();
    }, [actions, names]);

    return (
        <group
            // @ts-ignore
            ref={ref}
            onClick={handleClick}
            onPointerEnter={() => {
                document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
                document.body.style.cursor = "default";
            }}
        >
            <Gltf
                src={GLTF_PATH}
                position={modelPos}
                scale={[5, 5, 5]}
                castShadow
            />
        </group>
    )
}

function App() {
    return (
        <div id={"canvas-container"}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 7, 15]} />
                <OrbitControls maxPolarAngle={Math.PI / 2 - 0.1} enableZoom={true} target={[0, 3, 0]} />
                <Environment files={HDRI_PATH} background ground resolution={4000} />
                <ambientLight color={"#FFFFFF"} intensity={1} />
                <pointLight position={[10, 10, 10]} castShadow={true} />
                <Model />
            </Canvas>
            <div id={"license"}>
                <span>
                    This work is based on "Carbon Frame Bike" (https://sketchfab.com/3d-models/carbon-frame-bike-398999b3360b4e6997a9aae253d6acbd) by prefrontal cortex (https://sketchfab.com/prefrontalcortex) licensed under CC-BY-SA-4.0 (http://creativecommons.org/licenses/by-sa/4.0/)
                </span>
            </div>
        </div>
    )
}

export default App;
