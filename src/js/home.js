import * as THREE from "/src/js/three.js";
import * as TWEEN from "/src/js/tween.js"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas'),
});

let ticking = false;

// scroll progress
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

function lerp(start, end, amount) {
    return start * (1 - amount) + end * amount;
}

function invLerp(start, end, amount) {
    return (amount - start) / (end - start)
}

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
    let dest = lerp(from, to, s.prog);

    new TWEEN.Tween({val: currentVal})
    .to({val: dest}, time)
    .easing(easing)
    .onUpdate((e) => {
        func(e);
    })
    .start()
}

function mainloop() {
    requestAnimationFrame(mainloop);

    TWEEN.update();
    renderer.render(scene, camera); 
}

function onscroll() {
    t = document.body.getBoundingClientRect().top * -1;

    threeScroll("start", 1000, (s) => {
        tweenScroll(s, 0, 200, camera.position.z, e => camera.position.z = e.val)
    })

    threeScroll(1000, 2000, (s) => {
        tweenScroll(s, 0, Math.PI, camera.rotation.y, e => camera.rotation.y = e.val)
    })

    threeScroll(2000, "end", (s) => {
        tweenScroll(s, 200, 0, camera.position.z, e => camera.position.z = e.val)
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