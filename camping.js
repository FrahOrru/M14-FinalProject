import { TextureLoader, Group } from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const TL = new TextureLoader();
const GL = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const dl = new DRACOLoader();

const exportedGroup = new Group();
_loadCamping();

function _loadCamping() {
  dl.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
  dl.preload();
  const GL = new GLTFLoader();
  GL.setDRACOLoader(dl);

  const p1 = new Promise((res) => {
    GL.load("/camping2.glb", (v) => {
      v.scene.traverse(function (child) {
        if (child.isMesh) {
          child.receiveShadow = true;
        }
      });
      v.scene.scale.setScalar(0.23);
      v.scene.rotation.y = -90;
      v.scene.receiveShadow = true;

      console.log("aaaa camping");
      exportedGroup.add(v.scene);
    });
  });
}

export { exportedGroup };
