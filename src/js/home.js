import * as THREE from "/src/js/three.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
});

renderer.setPixelRatio(window.innerWidth / window.innerHeight);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

function createStars(amount) {
    let geometry = new THREE.SphereGeometry(0.25, 4, 4);
    let material = new THREE.MeshBasicMaterial({color: "white"});

    for (let i = 0; i < amount; i++) {
        let star = new THREE.Mesh(geometry, material);
        let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

        star.position.set(x, y, z);
        scene.add(star);
    }
}

function mainloop() {
    requestAnimationFrame(mainloop);


    renderer.render(scene, camera);
}

mainloop()
createStars(1000)