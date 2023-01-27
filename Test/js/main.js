import * as THREE from '../modules/three.module.js';
import {OrbitControls} from '../modules/OrbitControls.js'

const GRAVITY = 6.67 * Math.pow(10, -11);

let Earth = {
    m: 10,
    x: 0.0,
    y: 0.0,
    z: 0.0,
    vx: 0.0,
    vy: 0.0,
    vz: 0.0,
}
let Moon = {
    m: 1,
    x: 10,
    y: 0.0,
    z: 0.0,
    vx: 0.0,
    vy: -0.00001,
    vz: 0.0,
}

function GetA(m, dx, dy, dz) {
    const r = Math.pow(dx*dx + dy*dy + dz*dz, 1.5);
    const acceleration = GRAVITY * m / r;
    return acceleration
}

function SimPhysics(dt){
	const [dx, dy, dz] = [Moon.x - Earth.x, Moon.y - Earth.y, Moon.z - Earth.z];
    const AMoon = GetA(Earth.m, dx, dy, dz);
    const AEarth = GetA(Moon.m, dx, dy, dz);

   	const [eax, eay, eaz] = [dx * AEarth, dy * AEarth, dz * AEarth];
   	const [max, may, maz] = [-dx * AMoon, -dy * AMoon, -dz * AMoon];

   	Earth.vx += eax * dt;
	Earth.vy += eay * dt;
	Earth.vz += eaz * dt;

	Moon.vx += max * dt;
	Moon.vy += may * dt;
	Moon.vz += maz * dt;

	Earth.x += Earth.vx * dt;
	Earth.y += Earth.vy * dt;
	Earth.z += Earth.vz * dt;

	Moon.x += Moon.vx * dt;
	Moon.y += Moon.vy * dt;
	Moon.z += Moon.vz * dt;

}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);
light.position.y = 10;

var geometry = new THREE.SphereGeometry(1, 10, 10);
const material = new THREE.MeshStandardMaterial( { wireframe: true } );

var planet1 = new THREE.Mesh(geometry, material);
scene.add(planet1);

var planet2 = new THREE.Mesh(geometry, material);
scene.add(planet2);
planet2.position.x = 10;

camera.position.z = 100;
controls.update();

window.addEventListener("resize", function(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});

function MovePlanets(){
	SimPhysics(50000);
	planet1.position.x = Earth.x;
	planet1.position.y = Earth.y;
	planet1.position.z = Earth.z;

	planet2.position.x = Moon.x;
	planet2.position.y = Moon.y;
	planet2.position.z = Moon.z;

	controls.target = (new THREE.Vector3(planet1.position.x, planet1.position.y, planet1.position.z));
}

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
	MovePlanets()
}
animate();