    /*** 3D ANIMATIONS */
    // This part is for the 3D animations, which are created using Three.js library. The code is in the file "three-animations.js" and is imported in the index.html file.
    import * as THREE from 'https://esm.sh/three@0.150.1';
    import { GLTFLoader } from 'https://esm.sh/three@0.150.1/examples/jsm/loaders/GLTFLoader';
    import { OrbitControls } from 'https://esm.sh/three@0.150.1/examples/jsm/controls/OrbitControls';

    //Camera
    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 1, 3);

    //Scene 
    const scene = new THREE.Scene();
    let beeModel;
    let mixer;

    //Loader
    const loader = new GLTFLoader();
loader.load(
    'assets/stylized_flying_bee_bird_rigged.glb',
    function (gltf) {
        beeModel = gltf.scene;
        scene.add(beeModel);
        beeModel.scale.set(0.4, 0.4, 0.4);
        beeModel.position.set(37, 12, 3);
        beeModel.rotation.y = 4.8;
        camera.position.set(-5, 10, 55);
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

    //Lights
    const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.25);
    scene.add(ambientLight);

    // top light - white
    const topLight = new THREE.DirectionalLight(new THREE.Color('#cce8ff'), 1.8);
    topLight.position.set(5, 8, 15);
    scene.add(topLight);

    // left side - pink
    const pinkLight = new THREE.DirectionalLight(new THREE.Color('#ff61b3'), 0.5);
    pinkLight.position.set(-15, 3, 10);
    scene.add(pinkLight);

    // backlight -blue
    const backLight = new THREE.DirectionalLight(new THREE.Color('#0a7488'), 1.5);
    backLight.position.set(0, 0, -30);
    scene.add(backLight);
    
    //Renderer
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


    