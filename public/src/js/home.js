// imports
import * as THREE from "/src/js/lib/three.js";
import * as TWEEN from "/src/js/lib/tween.js";
import { GLTFLoader } from "/src/js/lib/gltf_loader.js";
import { OrbitControls } from "/src/js/lib/orbit_controls.js";
import { FontLoader } from "/src/js/lib/font_loader.js";
import { TextGeometry } from "/src/js/lib/text_geometry.js"

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

// monitor canvas
let monitor;
let monitorMaterial;
let monitorContentTag;

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

function createMonitorCanvas() {
    let canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;

    monitor = canvas.getContext('2d');
    monitor.imageSmoothingEnabled = false;
    
    monitor.fillStyle = 'black';
    monitor.fillRect(0, 0, canvas.width, canvas.height);

    monitor.font = '25px monospace';
    monitor.fillStyle = 'rgb(0, 255, 0)';
    monitor.textBaseline = "top"

    return canvas;
}

function createMonitorScreen() {
    let canvas = createMonitorCanvas();
    let geometry = new THREE.PlaneGeometry(1, 1);
    let texture = new THREE.CanvasTexture(canvas)

    monitorMaterial = new THREE.MeshBasicMaterial({
        map: texture
    })

    let screen = new THREE.Mesh(geometry, monitorMaterial);

    screen.position.x = 22.3;
    screen.position.y = 37.5;
    screen.position.z = -3.3;
    screen.scale.x = 16.6;
    screen.scale.y = 12.2;
    screen.rotation.x = -0.08;

    scene.add(screen);
}

function changeMonitorText(text, contentTag) {
    monitor.fillStyle = 'black';
    monitor.fillRect(0, 0, monitor.canvas.width, monitor.canvas.height);

    monitor.font = '20px monospace';
    monitor.fillStyle = 'rgb(0, 255, 0)';
    monitor.textBaseline = "top";

    let arrtext = text.split('\n');
    for (let i = 0; i < arrtext.length; i++) {
        monitor.fillText(arrtext[i], 10, 15 + (i * 20))
    }
    monitorMaterial.map.needsUpdate = true;
    monitorContentTag = contentTag
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

    threeScroll(1000, 2000, (s) => {
        tweenScroll(s, 22, 15, camera.position.z, e => camera.position.z = e.val)
    })

    threeScroll(2000, 3000, (s) => {
        tweenScroll(s, 25, -32, camera.position.x, e => camera.position.x = e.val)
        tweenScroll(s, 38, 47, camera.position.y, e => camera.position.y = e.val)
        tweenScroll(s, 15, -50, camera.position.z, e => camera.position.z = e.val)
        tweenScroll(s, 0, 0, camera.rotation.x, e => camera.rotation.x = e.val)
        tweenScroll(s, 0, -2.8, camera.rotation.y, e => camera.rotation.y = e.val)
        tweenScroll(s, 0, 0, camera.rotation.z, e => camera.rotation.z = e.val)
    })

    threeScroll(3000, 4000, (s) => {
        tweenScroll(s, -32, 15, camera.position.x, e => camera.position.x = e.val)
        tweenScroll(s, -50, 30, camera.position.z, e => camera.position.z = e.val)
    })

    threeScroll(4000, 5000, (s) => {
        if (monitorContentTag != "programming") {
            changeMonitorText(
                "C:\\Jhareign>git add .\n" + 
                "C:\\Jhareign>git commit -m Final commit\n" +
                "final commit of website\n" +
                "3 files changed", "48 insertions(+), 3 deletions(-)", "programming")

                
        }

        tweenScroll(s, 15, 21, camera.position.x, e => camera.position.x = e.val)
        tweenScroll(s, 47, 38, camera.position.y, e => camera.position.y = e.val)
        tweenScroll(s, 30, 22, camera.position.z, e => camera.position.z = e.val)
        tweenScroll(s, 0, 0, camera.rotation.x, e => camera.rotation.x = e.val)
        tweenScroll(s, -2.8, 0, camera.rotation.y, e => camera.rotation.y = e.val)
        tweenScroll(s, 0, 0, camera.rotation.z, e => camera.rotation.z = e.val)
    })

    threeScroll(5000, 6000, (s) => {
        tweenScroll(s, 22, 15, camera.position.z, e => camera.position.z = e.val)
    })
}

function mainloop() {
    requestAnimationFrame(mainloop);

    TWEEN.update();
    //controls.update();
    renderer.render(scene, camera);

    //console.log(camera.position)
}

function onload() {
    mainloop()

    createLights()
    createStars(10000, 500, 100)
    loadSceneModel()
    createMonitorScreen()
    changeMonitorText("C:\\Jhareign>webapp run", "initial")

    scrollbarRestorer()

    onscroll()
    onresize()

    initCameraPosition()
}


// declarations (set)
document.body.onscroll = onscrolloptimize;
document.body.onload = onload;
document.body.onresize = onresize;