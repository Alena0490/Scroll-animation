import * as THREE from 'https://esm.sh/three@0.150.1';
import { GLTFLoader } from 'https://esm.sh/three@0.150.1/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'https://esm.sh/three@0.150.1/examples/jsm/libs/meshopt_decoder.module.js';
import gsap from 'https://esm.sh/gsap@3.12.2';

if (window.innerWidth > 768) {
    initScene();
}

function initScene() {

    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 1, 3);

    const scene = new THREE.Scene();
    let beeModel;
    let mixer;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
        'assets/stylized_flying_bee_bird_rigged-v4.glb',
        function (gltf) {
            beeModel = gltf.scene;
            scene.add(beeModel);
            beeModel.scale.set(0.4, 0.4, 0.4);
            beeModel.position.set(47, 4, 2);
            beeModel.rotation.y = 4.8;
            beeModel.rotation.x = 0.3;
            camera.position.set(0, 12, 60);
            mixer = new THREE.AnimationMixer(beeModel);
            mixer.clipAction(gltf.animations[0]).play();
            mixer.update(0.02);

            const textureLoader = new THREE.TextureLoader();
            const pinkTexture = textureLoader.load('assets/texture.png');
            pinkTexture.flipY = false;

            beeModel.traverse((child) => {
                if (child.isSkinnedMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        map: pinkTexture,
                        roughness: 0.8,
                        metalness: 0.2,
                    });
                }
            });
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened', error);
        }   
    );

    let ArrayPositionModel = [
        { 
            id: 'hero',
            position: { x: -40, y: -21, z: -6 },
            rotation: { x: 0, y: 1.6, z: 0 } 
        }, { 
            id: 'about', 
            position: { x: -42, y: 25, z: 0 },
            rotation: { x: 0.5, y: 1.8, z: 0 } 
        }, { 
            id: 'projects', 
            position: { x: 37, y: 37, z: 1 },
            rotation: { x: 0.3, y: 4.7, z: 0 } 
        }, { 
            id: 'contacts', 
            position: { x: 47, y: 4, z: 2 },
            rotation: { x: 0, y: 4.8, z: 0 } 
        }        
    ];

    const modelMove = () => {
        const sections = document.querySelectorAll('#hero, #about, #projects, #contacts');
        let currentSection;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 3) {
                currentSection = section.id;
            }
        });

        const currentData = ArrayPositionModel.find(item => item.id === currentSection);

        if (currentData) {
            gsap.to(beeModel.position, {
                x: currentData.position.x,
                y: currentData.position.y,
                z: currentData.position.z,
                duration: 1.6,
                ease: "sine.inOut"
            });

            const dx = camera.position.x - beeModel.position.x;
            const dz = camera.position.z - beeModel.position.z;
            const targetY = Math.atan2(dx, dz);
            const delta = targetY - currentData.rotation.y;
            const clamped = Math.max(-0.4, Math.min(0.4, delta));

            gsap.to(beeModel.rotation, {
                x: currentData.rotation.x,
                y: currentData.rotation.y + clamped,
                z: currentData.rotation.z,
                duration: 0.4,
                delay: 1.6,
                ease: "power1.out"
            });
        }
    };

    window.addEventListener('scroll', () => {
        if (beeModel) {
            modelMove();
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.25);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(new THREE.Color('#cce8ff'), 1.8);
    topLight.position.set(5, 8, 15);
    scene.add(topLight);

    const pinkLight = new THREE.DirectionalLight(new THREE.Color('#ff61b3'), 0.5);
    pinkLight.position.set(-15, 3, 10);
    scene.add(pinkLight);

    const backLight = new THREE.DirectionalLight(new THREE.Color('#0a7488'), 1.5);
    backLight.position.set(0, 0, -30);
    scene.add(backLight);

    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container3D').appendChild(renderer.domElement);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        if (mixer) {
            mixer.update(0.02);
        }
    }
    animate();

}