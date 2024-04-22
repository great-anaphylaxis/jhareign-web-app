// imports
import * as THREE from "/src/js/lib/three.js";
import * as TWEEN from "/src/js/lib/tween.js";
import { GLTFLoader } from "/src/js/lib/gltf_loader.js";
import { OrbitControls } from "/src/js/lib/orbit_controls.js";

// Three.js essentials
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas'),
});
//const controls = new OrbitControls( camera, renderer.domElement )


// for optimizing scrolling
let ticking = false;

// scroll progress
let t = 0

// essential utility functions
function lerp(start, end, amount) {
    return start * (1 - amount) + end * amount;
}

function invLerp(start, end, amount) {
    return (amount - start) / (end - start)
}


// website "system" functions
function threeScroll(min, max, func) {
    if (min == "start") {
        min = 0;
    }

    if (max == "end") {
        max = Math.max(document.body.scrollHeight, 
            document.body.offsetHeight, 
            document.documentElement.clientHeight, 
            document.documentElement.scrollHeight, 
            document.documentElement.offsetHeight
        );
    }

    let s = {
        from: min,
        to: max,
        prog: invLerp(min, max, t)
    }

    if (t > min && t < max) {
        func(s)
    }
}

function tweenScroll(s, from, to, currentVal, func, time = 1500, easing = TWEEN.Easing.Exponential.Out) {
    if (s == "start") {
        func({val: from});

        return;
    }

    let dest = lerp(from, to, s.prog);

    new TWEEN.Tween({val: currentVal})
    .to({val: dest}, time)
    .easing(easing)
    .onUpdate((e) => {
        func(e);
    })
    .start()
}

function scrollbarRestorer() {
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    } 
    
    else {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
    }
}


// functions for use
function createStars(amount, fieldSize, bound) {
    let geometry = new THREE.SphereGeometry(0.25, 4, 4);
    let material = new THREE.MeshBasicMaterial({color: "white"});

    for (let i = 0; i < amount; i++) {
        let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(fieldSize))

        if (
            x < bound && x > -bound &&
            y < bound && y > -bound &&
            z < bound && z > -bound
        ) {
            continue;
        }

        let star = new THREE.Mesh(geometry, material);

        star.position.set(x, y, z);
        scene.add(star);
    }
}

function loadSceneModel() {
    let laoder = new GLTFLoader();

    laoder.load('/src/3d models/scene.glb', (gltf) => {
        gltf.scene.scale.x = 0.5;
        gltf.scene.scale.y = 0.5;
        gltf.scene.scale.z = 0.5;
        scene.add(gltf.scene);
    })
}

function createLights() {
    let ambientlight = new THREE.AmbientLight("white", 0.8)
    scene.add(ambientlight);

    let light1 = new THREE.DirectionalLight("white", 0.9);
    light1.position.y = 3;
    scene.add(light1)

    let light2 = new THREE.DirectionalLight("white", 0.9);
    light2.position.x = 20;
    light2.position.y = 43;
    light2.position.z = 23;
    scene.add(light2)
}

function initCameraPosition() {
    camera.position.x = -56;
    camera.position.y = 53;
    camera.position.z = 52;
    camera.rotation.x = -0;
    camera.rotation.y = -0.9;
    camera.rotation.z = 0;
}



// event functions
function onscrolloptimize() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            onscroll();
            ticking = false;
        });
  
        ticking = true;
    }
}

function onresize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


// very important functions
function onscroll() {
    t = document.body.getBoundingClientRect().top * -1;

    threeScroll("start", 1000, (s) => {
        tweenScroll(s, -56, 25, camera.position.x, e => camera.position.x = e.val)
        tweenScroll(s, 53, 38, camera.position.y, e => camera.position.y = e.val)
        tweenScroll(s, 52, 22, camera.position.z, e => camera.position.z = e.val)
        tweenScroll(s, 0, 0, camera.rotation.x, e => camera.rotation.x = e.val)
        tweenScroll(s, -0.9, 0, camera.rotation.y, e => camera.rotation.y = e.val)
        tweenScroll(s, 0, 0, camera.rotation.z, e => camera.rotation.z = e.val)
    })

    // threeScroll(1000, 2000, (s) => {
    //     tweenScroll(s, 0, Math.PI, camera.rotation.y, e => camera.rotation.y = e.val)
    // })

    // threeScroll(2000, "end", (s) => {
    //     tweenScroll(s, 200, 0, camera.position.z, e => camera.position.z = e.val)
    // })
}

function mainloop() {
    requestAnimationFrame(mainloop);

    TWEEN.update();
    //controls.update();
    renderer.render(scene, camera);

    console.log(camera.position)
}

function onload() {
    mainloop()

    createLights()
    createStars(10000, 500, 100)
    loadSceneModel()

    scrollbarRestorer()

    onscroll()
    onresize()

    initCameraPosition()
}


// declarations (set)
document.body.onscroll = onscrolloptimize;
document.body.onload = onload;
document.body.onresize = onresize;