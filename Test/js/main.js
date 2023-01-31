import * as THREE from '../modules/three.module.js';
import {OrbitControls} from '../modules/OrbitControls.js'
import {CSS2DRenderer, CSS2DObject} from "../modules/CSS2DRenderer.js"

const GRAVITY = 6.67 * Math.pow(10, -11);
let planets = [];


class Some_planet{
	constructor(name = null, description=null, main_planet){
		this.planet_name = name
		this.planet_description = description,
		this.tree_planet = main_planet
	}
}


function Planet(mass, planetmesh){
	this.m = mass;
	this.r = 1;
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.vx = 0.0;
    this.vy = 0.0;
    this.vz = 0.0;
    this.mesh = planetmesh;
    scene.add(this.mesh);
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
			SimPhysics(100, planets[i].tree_planet, planets[j].tree_planet)
		};
	};

	for (let i = 0; i < planets.length; i++){
		planets[i].tree_planet.mesh.position.x = planets[i].tree_planet.x;
		planets[i].tree_planet.mesh.position.y = planets[i].tree_planet.y;
		planets[i].tree_planet.mesh.position.z = planets[i].tree_planet.z;
	};
}


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const htmlrenderer = new CSS2DRenderer();
// htmlrenderer.setSize(window.innerWidth, window.innerHeight);
// htmlrenderer.domElement.style.position = "absolute";
// htmlrenderer.domElement.style.top = "0px";
// htmlrenderer.domElement.style.pointerEvents = "none";
// document.body.appendChild(htmlrenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);
light.position.y = 10;

const geometry = new THREE.SphereGeometry(1, 8, 8);
const material = new THREE.MeshStandardMaterial( { wireframe: true } );

// const menu = new CSS2DObject(m);
// scene.add(menu);




let earth_tree = new Planet(5000, new THREE.Mesh(geometry, material));

let Earth = new Some_planet("Earth", "Our planet", earth_tree)

let moon1_tree = new Planet(1, new THREE.Mesh(geometry, material));
moon1_tree.mesh.position.x = 50;
moon1_tree.x = 10;
moon1_tree.vy = -0.0001

let Moon1 = new Some_planet("Moon1", "Our moon", moon1_tree)

let moon2_tree = new Planet(1, new THREE.Mesh(geometry, material));
moon2_tree.mesh.position.x = -10;
moon2_tree.x = -10
moon2_tree.vx = 0.0001


let Moon2 = new Some_planet("Moon2", "leshless pidor", moon2_tree)

planets.push(Earth, Moon1, Moon2)


console.log(planets)

function add_element_to_menu(el){
	const doc = document.getElementById("sidebar")
	doc.innerHTML  += `<br>${el.planet_name}</br>`
}


window.addEventListener("resize", function(){
	let width = window.innerWidth;
	let height = window.innerHeight;
	renderer.setSize(width, height);
	// htmlrenderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});


function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
	// htmlrenderer.render( scene, camera );
	MovePlanets(planets);
}
animate();