import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const scene = new THREE.Scene();
// scene.background = new THREE.Color("rgb(20%, 50%, 50%)");
const bgld = new THREE.TextureLoader();
bgld.load(
  'background/glacier.JPG', // Replace with the path to your image
  function(texture) {
    // Apply the texture as the background of the scene
    scene.background = texture;
  },
  undefined, // onProgress callback not needed here
  function(err) {
    console.error('An error happened.', err);
  }
);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(scene.position);

const light = new THREE.AmbientLight(0xffffff, 100); // Soft white light
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add an object
const objects = [];
// const geometer = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({color: 0xff6347, wireframe: false});
// const torus = new THREE.Mesh(geometer, material);
// scene.add(torus);
// objects.push(torus);

// add orbit control
const orbCtrl = new OrbitControls(camera, renderer.domElement);

// add drag control
const dragCtrl = new DragControls(objects, camera, renderer.domElement);
dragCtrl.addEventListener( 'dragstart', function ( event ) {

	event.object.material.emissive.set( 0xaaaaaa );

} );

dragCtrl.addEventListener( 'dragend', function ( event ) {

	event.object.material.emissive.set( 0x000000 );

} );

// OBJ Loader
// const loader = new OBJLoader();
// loader.load(
//   '/CCTV_Camera.obj', // Path to your OBJ file
//   function(obj) {
//     scene.add(obj);
//     objects.push(torus);
//     obj.position.set(0, 0, 0); // Adjust position if needed
//   },
//   function(xhr) {
//     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//   },
//   function(error) {
//     console.log('An error happened');
//   }
// );

// GLTF Loader
const loader = new GLTFLoader();
loader.load(
  '/gear1/Gear1.gltf', 
  function(gltf) {
    gltf.scene.traverse(function(child) {
      if (child.isMesh) {
        // Extract the geometry
        const geometry = child.geometry;
        geometry.rotateX(Math.PI / 2);

        // Position attribute of the target geometry
        const ptnpos= geometry.getAttribute('position');
        var cubeNum = 10;
        const cubeOrigin = [0, 0, -15];

        const cubeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3); // Small cube size
        const cubeMaterials = [];
        for(let j = 0; j < cubeNum; j++){
          var opa = 0.1 + 0.9 *(j / (cubeNum-1));
          let cubeMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('gear1/textures/baseColor.jpg'),
            // color: 0x00ff00
            transparent: true,
            opacity: opa
          });
          cubeMaterials.push(cubeMaterial);

        }


        for (let i = 0; i < ptnpos.count; i++) {
          if (Math.random()>0.99){
            
            // const j = 1;
            // const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            // cube.scale.set((1 - j / cubeNum), (1 - j / cubeNum), (1 - j / cubeNum));
            // cube.position.x = ptnpos.getX(i);//*(1 - j / cubeNum) + cubeOrigin[0]*j/cubeNum;
            // cube.position.y = ptnpos.getY(i);//*(1 - j / cubeNum) + cubeOrigin[1]*j/cubeNum;
            // cube.position.z = ptnpos.getZ(i);//*(1 - j / cubeNum) + cubeOrigin[2]*j/cubeNum;
            // console.log(cube.material.children);
            // scene.add(cube);

            for (let j = 0; j < cubeNum; j++){
              const cube = new THREE.Mesh(cubeGeometry, cubeMaterials[j]);

              // cube.scale.set((1 - j / cubeNum), (1 - j / cubeNum), (1 - j / cubeNum));
              cube.position.x = ptnpos.getX(i)*(1 - j / cubeNum) + cubeOrigin[0]*j/cubeNum;
              cube.position.y = ptnpos.getY(i)*(1 - j / cubeNum) + cubeOrigin[1]*j/cubeNum;
              cube.position.z = ptnpos.getZ(i)*(1 - j / cubeNum) + cubeOrigin[2]*j/cubeNum;
              
              // cube.traverse((child) => {
              //   if (child.isMesh){
                  
              //     child.material.opacity = 1 - j / cubeNum * 0.9;
              //     console.log(child.material.opacity);
              //   }
              // })

              scene.add(cube); 
            }

          
          }
        }

      }
    });
  }
, undefined, (error) => {
  console.error(error);
});

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();