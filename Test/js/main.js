import * as THREE from '../modules/three.module.js';
import {OrbitControls} from '../modules/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.SetClearColor(0xffffff, 0)
document.body.appendChild( renderer.domElement );

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);
light.position.y = 10;

var geometry = new THREE.SphereGeometry(7);
var texture = new THREE.TextureLoader().load("/images/gofman.jpg");
const material = new THREE.MeshStandardMaterial( { map: texture } );
const cube1 = new THREE.Mesh( geometry, material );
scene.add( cube1 );

geometry = new THREE.SphereGeometry(1);
const cube2 = new THREE.Mesh( geometry, material );
scene.add( cube2 );
cube2.position.x = 256;

camera.position.z = 10;
controls.update();

window.addEventListener("resize", function(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});

var angle = 0;

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
	angle += Math.PI * 0.003;
	cube2.position.x = Math.cos(angle) * 16;
	cube2.position.z = Math.sin(angle) * 16;

}
animate();