import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./style.css";

const container = document.getElementById("scene-container");
if (!container) {
  throw new Error("找不到场景容器 #scene-container");
}

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
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
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

// 为 PBR 材质提供环境反射，提升金属与粗糙度细节表现
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = envTexture;

const grid = new THREE.GridHelper(24, 24, 0xaaaaaa, 0xd4d4d4);
scene.add(grid);
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24),
  new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 1.0 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

const status = document.getElementById("status");

function frameCameraToObject(object3D) {
  const box = new THREE.Box3().setFromObject(object3D);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / (2 * Math.tan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.5;

  camera.position.set(center.x + distance, center.y + distance * 0.4, center.z + distance);
  camera.near = 0.01;
  camera.far = distance * 20;
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.minDistance = distance * 0.2;
  controls.maxDistance = distance * 5;
  controls.update();
}

const modelUrl = "/models/DamagedHelmet/DamagedHelmet.gltf";
const loader = new GLTFLoader();
loader.load(
  modelUrl,
  (gltf) => {
    const model = gltf.scene;
    model.position.y = 0.6;
    scene.add(model);
    frameCameraToObject(model);

    if (status) {
      status.textContent = "模型加载成功：DamagedHelmet (glTF + 贴图)";
      status.classList.remove("status-error");
      status.classList.add("status-success");
    }
  },
  undefined,
  (error) => {
    console.error("模型加载失败:", error);
    if (status) {
      status.textContent = "模型加载失败，请检查本地模型资源是否存在。";
      status.classList.remove("status-success");
      status.classList.add("status-error");
    }
  }
);

function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("resize", onWindowResize);

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
