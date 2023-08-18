import { exportedGroup } from "./camping.js";
const canvas = document.querySelector("canvas.webgl");
const raycaster = new THREE.Raycaster();

const cursor = {};
cursor.x = 0;
cursor.y = 0;

// Scene
const scene = new THREE.Scene();

let scrollY = window.scrollY;
let currentSection = 0;

const TL = new THREE.TextureLoader();
const texture = TL.load("/lroc_color_poles_1k.jpg");
const displacement = TL.load("/ldem_3_8bit.jpg");

const materialMesh1 = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  map: texture,
  displacementMap: displacement,
  displacementScale: 0.05,
  bumpMap: displacement,
  bumpScale: 0.04,
});

// Meshes
const mesh1 = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  materialMesh1
);
mesh1.scale.setScalar(0.4);
mesh1.castShadow = true;

const objectsDistance = 4;

mesh1.position.y = -objectsDistance * 0;

exportedGroup.position.y = -objectsDistance * 1.3;

mesh1.position.x = 2;

mesh1.name = "mesh1";

const sectionMeshes = [mesh1, exportedGroup];

scene.add(mesh1, exportedGroup);

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);

  if (newSection != currentSection && currentSection.name === "mesh1") {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
    });
  }
});

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(-100, 10, 5);
directionalLight.intensity = 0.9;
directionalLight.castShadow = true;

scene.add(directionalLight);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Cameras
 */

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Particels & Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: "#ffeded",
  sizeAttenuation: true,
  size: 0.03,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  for (const mesh of sectionMeshes) {
    if (mesh.name === "mesh1") {
      mesh.rotation.x += deltaTime * 0.1;
      mesh.rotation.y += deltaTime * 0.12;
    }
  }

  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  raycaster.setFromCamera(cursor, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].name !== "mesh1") {
    }
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
