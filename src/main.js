import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import "./style.css";

const container = document.getElementById("app");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe7eef7);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(6, 4, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.2, 0);
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 6);
scene.add(directionalLight);

const grid = new THREE.GridHelper(24, 24, 0xaaaaaa, 0xd4d4d4);
scene.add(grid);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24),
  new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 1.0 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

const status = document.getElementById("status");

const loader = new OBJLoader();
loader.load(
  "/models/house.obj",
  (object) => {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xb3c0d1,
          roughness: 0.85,
          metalness: 0.05,
        });
      }
    });
    object.position.y = 0;
    scene.add(object);
    if (status) {
      status.textContent = "模型加载成功：house.obj";
    }
  },
  undefined,
  (error) => {
    console.error("模型加载失败:", error);
    if (status) {
      status.textContent = "模型加载失败，请检查资源路径。";
    }
  }
);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
