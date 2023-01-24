import * as THREE from '../modules/three.module.js';
import {OrbitControls} from '../modules/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);
light.position.y = 10;

var geometry = new THREE.SphereGeometry(1);
var texture = new THREE.TextureLoader().load("/images/gofman.jpg");
const material = new THREE.MeshStandardMaterial( { map: texture } );

function Planet(m) {
	this.mass = m;
	this.mesh = new THREE.Mesh(geometry, material);
}

var planet1 = new Planet(10); 
scene.add(planet1.mesh);

var planet2 = new Planet(30)
scene.add(planet2.mesh);
planet2.mesh.position.x = 256;

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
	planet2.mesh.position.x = Math.cos(angle) * 16;
	planet2.mesh.position.z = Math.sin(angle) * 16;

}
animate();