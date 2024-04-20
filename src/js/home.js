import * as THREE from "/src/js/three.js";
import * as TWEEN from "/src/js/tween.js"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas'),
});

let ticking = false;

let t = 0

function createStars(amount, fieldSize) {
    let geometry = new THREE.SphereGeometry(0.25, 4, 4);
    let material = new THREE.MeshBasicMaterial({color: "white"});

    for (let i = 0; i < amount; i++) {
        let star = new THREE.Mesh(geometry, material);
        let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(fieldSize))

        star.position.set(x, y, z);
        scene.add(star);
    }
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

function threeScroll(min, max, func) {
    if (min == "start" && max == "end") {
        func();
    }

    else if (min == "start") {
        if (t < max) {
            func();
        }
    }

    else if (max == "end") {
        if (t > min) {
            func();
        }
    }

    else if (t > min && t < max) {
        func()
    }
}


function mainloop() {
    requestAnimationFrame(mainloop);

    TWEEN.update();
    renderer.render(scene, camera); 
}

function onscroll() {
    t = document.body.getBoundingClientRect().top * -1;

    threeScroll("start", "end", () => {
        let toZ = t * 0.05;

        let tween = new TWEEN.Tween({z: camera.position.z})
        .to({z: toZ}, 2000)
        .easing(TWEEN.Easing.Exponential.Out)
        .onUpdate((e) => {
            camera.position.z = e.z;
        })
        .start()
    })

}

function onload() {
    mainloop()

    createStars(10000, 500)

    scrollbarRestorer()

    onscroll()
    onresize()
}

function onresize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


document.addEventListener("scroll", (e) => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            onscroll();
            ticking = false;
        });
  
        ticking = true;
    }
});

document.body.onload = onload;
document.body.onresize = onresize;