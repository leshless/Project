import * as THREE from '../modules/three.module.js';
import {OrbitControls} from '../modules/OrbitControls.js'
import { TWEEN } from '../modules/tween.module.min.js'

const GRAVITY = 6.67 * Math.pow(10, -11);
let planets = [];
let planetid = 0;

function GetMesh(name, isghost){
	let color = 0xffffff
	if (isghost){color = 0x444444}
	return new THREE.Mesh(new THREE.SphereGeometry(planetinfo.get(name).radius, 8, 8), new THREE.MeshStandardMaterial( { wireframe: true, color: color} ))
}

class Planet {
	constructor(name, vector3) {
		this.info = {}
		Object.assign(this.info, planetinfo.get(name))

		this.m = this.info.mass;
		this.r = this.info.radius;

		this.x = vector3.x;
		this.y = vector3.y;
		this.z = vector3.z;
		this.vx = 0.0001;
		this.vy = 0.0;
		this.vz = 0.0;

		this.mesh = GetMesh(name, false);
		scene.add(this.mesh);
		this.mesh.position.copy(ghostpos);
		this.mesh.name = planetid;
		planetid += 1;
		planets.push(this);
	}
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
camera.position.set(0, 30, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.update();

const prvwcamera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);

const prvwrenderer = new THREE.WebGLRenderer({canvas: document.getElementById("prvwcanvas")});
document.getElementById("right-sidebar").insertBefore(prvwrenderer.domElement, document.getElementById("description"))

const prvwcontrols = new OrbitControls(prvwcamera, prvwrenderer.domElement);
prvwcontrols.enablePan = false;
prvwcontrols.enableZoom = false;
prvwcontrols.autoRotate = true;
prvwcontrols.update();

const ratio = +document.getElementById("right-sidebar").clientWidth;
prvwrenderer.setSize(ratio, ratio);
prvwcamera.aspect = ratio / ratio;
prvwcamera.updateProjectionMatrix();

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

function SelectObject(object){
	if (object != currentselected){
        tbl.innerHTML = ""
        currentselected = object;
		ChangeCameraTarget();
        for (const [name, info] of Object.entries(object.info)) {
            const row = document.createElement("tr");
            row.className = "description-node"
            const propertyname = document.createElement("td");
            const propertynametext = document.createTextNode(name);
            propertyname.appendChild(propertynametext);
            const propertyinfo = document.createElement("td");
            const propertyinfotext = document.createTextNode(info);
            propertyinfo.appendChild(propertyinfotext);
            row.appendChild(propertyname);
            row.appendChild(propertyinfo);
            tbl.appendChild(row)
        }
    }
}

document.getElementById('canvas').onclick = function(){
	if (currentover){
        SelectObject(currentover);
	}
}

function ChangeCameraTarget(){
	const initposition = {
		x: camera.position.x,
		y: camera.position.y,
		z: camera.position.z,
		lax: controls.target.x,
		lay: controls.target.y,
		laz: controls.target.z,
	}

	const endposition = {
		x: currentselected.mesh.position.x,
		y: currentselected.mesh.position.y + 40,
		z: currentselected.mesh.position.z + 40,
		lax: currentselected.mesh.position.x,
		lay: currentselected.mesh.position.y,
		laz: currentselected.mesh.position.z,
	}


	const tweenposition = new TWEEN.Tween(initposition)
	.to(endposition, 1000)
	.onUpdate(function(position){
		camera.position.set(position.x, position.y, position.z);
		camera.lookAt(position.lax, position.lay, position.laz)})
	.easing(TWEEN.Easing.Quartic.Out)
	.onComplete(function() {
		controls.target.copy(currentselected.mesh.position);
		controls.update()
		});
	tweenposition.start();

	prvwcamera.position.set(currentselected.mesh.position.x + currentselected.r, currentselected.mesh.position.y, currentselected.mesh.position.z);
	prvwcontrols.target.copy(currentselected.mesh.position);
	prvwcontrols.minDistance = currentselected.r *3;
	prvwcontrols.maxDistance = currentselected.r *3;
	prvwcamera.lookAt(currentselected.mesh.position);
	prvwcontrols.update()
}

const prevposition = new THREE.Vector3();
function ChangeCameraPosition(){
	if (currentselected != null){
		const deltaposition = new THREE.Vector3();
		deltaposition.copy(currentselected.mesh.position);
		deltaposition.sub(prevposition);

		camera.position.set(deltaposition.x + camera.position.x, deltaposition.y + camera.position.y, deltaposition.z + camera.position.z);
		controls.target.copy(currentselected.mesh.position);
		controls.update();

		prvwcamera.position.set(deltaposition.x + prvwcamera.position.x, deltaposition.y + prvwcamera.position.y, deltaposition.z + prvwcamera.position.z);
		prvwcontrols.target.copy(currentselected.mesh.position);
		prvwcontrols.update()

		prevposition.copy(currentselected.mesh.position);
	}
}

let mousepos = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let ghostpos = new THREE.Vector3();
let intersects;

let currentghostmesh;
let currentplaceble = false
function HandleGhost(){
	if (currentpressed && overcanvas) {
		if (currentghostmesh == null){currentghostmesh = GetMesh(currentpressed, true)}
		scene.add(currentghostmesh);
		currentghostmesh.position.copy(ghostpos);
		currentplaceble = currentpressed;
	}else if (currentplaceble && overcanvas){
		scene.remove(currentghostmesh);
		currentghostmesh = null
		new Planet(currentplaceble, ghostpos);
		currentplaceble = false;
	}else{
		scene.remove(currentghostmesh);
		currentghostmesh = null
		currentplaceble = false;
	}
}

window.onmousemove = function(e){
	if (overcanvas){
		mousepos.x = (e.clientX / window.innerWidth) * 2 - 1;
		mousepos.y = -(e.clientY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(mousepos, camera);
		intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length == 1){
			ghostpos.copy(intersects[0].point)
			currentover = null;
		}else{
			intersects.forEach(function(intersect){
				if (intersect.object.name === "plane"){
					ghostpos.copy(intersect.point);
				}else{
					planets.forEach(function(planet){
						if(intersect.object.name === planet.mesh.name){
							currentover = planet;
						}
					})
				}
			})
		}
		
	}
};

window.onresize = function(){
	let width = window.innerWidth;
	let height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	const ratio = +document.getElementById("right-sidebar").clientWidth;
	prvwrenderer.setSize(ratio, ratio);
	prvwcamera.aspect = ratio / ratio;
	prvwcamera.updateProjectionMatrix();
};

function animate(t) {
	requestAnimationFrame( animate );
	HandleGhost();
	MovePlanets(planets);
	TWEEN.update(t);
	ChangeCameraPosition();
	renderer.render( scene, camera );
	prvwrenderer.render(scene, prvwcamera)
}
animate();