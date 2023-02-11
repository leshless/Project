import * as THREE from '../modules/three.module.js';
import {OrbitControls} from '../modules/OrbitControls.js'

const GRAVITY = 6.67 * Math.pow(10, -11);
let planets = [];

function Planet(mass, x, y, z, planetmesh){
	this.m = mass;
	this.r = 1;
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = 0.0;
    this.vy = 0.0;
    this.vz = 0.0;
    this.mesh = planetmesh;
    scene.add(this.mesh);
	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.position.z = z;
	planets.push(this)
}

function GetA(m, dx, dy, dz) {
    const r = Math.pow(dx*dx + dy*dy + dz*dz, 1.5);
    const acceleration = GRAVITY * m / r;
    return acceleration
}

function SimPhysics(dt, planet1, planet2){
	const [dx, dy, dz] = [planet1.x - planet2.x, planet1.y - planet2.y, planet1.z - planet2.z];
    const A1 = GetA(planet2.m, dx, dy, dz);
    const A2 = GetA(planet1.m, dx, dy, dz);

   	const [p2ax, p2ay, p2az] = [dx * A2, dy * A2, dz * A2];
   	const [p1ax, p1ay, p1az] = [-dx * A1, -dy * A1, -dz * A1];

   	planet2.vx += p2ax * dt;
	planet2.vy += p2ay * dt;
	planet2.vz += p2az * dt;

	planet1.vx += p1ax * dt;
	planet1.vy += p1ay * dt;
	planet1.vz += p1az * dt;


	if (planet1.r + planet2.r >= Math.pow(dx*dx + dy*dy + dz*dz, 1.5)){
		planet2.vx *= -1 / 2;
		planet2.vy *= -1 / 2;
		planet2.vz *= -1 / 2;

		planet1.vx *= -1 / 2;
		planet1.vy *= -1 / 2;
		planet1.vz *= -1 / 2;
	}

	planet2.x += planet2.vx * dt;
	planet2.y += planet2.vy * dt;
	planet2.z += planet2.vz * dt;

	planet1.x += planet1.vx * dt;
	planet1.y += planet1.vy * dt;
	planet1.z += planet1.vz * dt;
}

function MovePlanets(planets){
	for (let i = 0; i < planets.length - 1; i++){
		for (let j = i + 1; j < planets.length; j++){
			SimPhysics(100, planets[i], planets[j])
		};
	};

	for (let i = 0; i < planets.length; i++){
		planets[i].mesh.position.x = planets[i].x;
		planets[i].mesh.position.y = planets[i].y;
		planets[i].mesh.position.z = planets[i].z;
	};
}


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 15, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);
light.position.y = 10;

const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(1000, 1000, 100, 100),
	new THREE.MeshBasicMaterial({wireframe: true, side: "doubleside", color: 0x111111})
)
plane.name = "plane";
scene.add(plane);
plane.rotation.x += Math.PI / 2

const geometry = new THREE.SphereGeometry(1, 8, 8);
const material = new THREE.MeshStandardMaterial( { wireframe: true, color: 0xffffff} );

let earthghost = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial( { wireframe: true, color: 0x444444} ));
let earth_tree = new Planet(5000, 0, 0, 0, new THREE.Mesh(geometry, material));

let mousepos = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
var ghostpos = new THREE.Vector3();
let intersects;

window.onmousemove = function(e){
	mousepos.x = (e.clientX / window.innerWidth) * 2 - 1;
	mousepos.y = -(e.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mousepos, camera);
	intersects = raycaster.intersectObjects(scene.children);
	intersects.forEach(function(intersect){
		if (intersect.object.name === "plane"){
			ghostpos.copy(intersect.point);
		}
	})
};

window.onresize = function(){
	let width = window.innerWidth;
	let height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
};


let ghostplaceble = false
function HandleGhost(){
	if (earthdown && overcanvas) {
		scene.add(earthghost);
		earthghost.position.copy(ghostpos);
		ghostplaceble = true;
	}else if (ghostplaceble && overcanvas){
		scene.remove(earthghost);
		let newplanet = new Planet(1, ghostpos.x, ghostpos.y, ghostpos.z, new THREE.Mesh(geometry, material));
		ghostplaceble = false;
	}else{
		scene.remove(earthghost);
		ghostplaceble = false;
	}
}


function animate() {
	requestAnimationFrame( animate );
	controls.update();
	HandleGhost();
	MovePlanets(planets);
	renderer.render( scene, camera );
}
animate();