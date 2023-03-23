import * as THREE from '../modules/three.module.js';
import {OrbitControls} from '../modules/OrbitControls.js'
import { TWEEN } from '../modules/tween.module.min.js'
 
let currentselected = null;
let mousepos = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let ghostpos = new THREE.Vector3();
let intersects;
let currentghostmesh;
let currentover = null;

const GRAVITY = 6.67 * Math.pow(10, -11);
let planets = [];
let planetid = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 30, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas"), antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.04;
controls.update();

const prvwscene = new THREE.Scene();

const prvwcamera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);

const prvwrenderer = new THREE.WebGLRenderer({canvas: document.getElementById("prvwcanvas"), antialias: true});
prvwrenderer.setPixelRatio(document.getElementById("prvwcanvas").devicePixelRatio);
document.getElementById("right-sidebar").insertBefore(prvwrenderer.domElement, document.getElementById("description"))

const prvwcontrols = new OrbitControls(prvwcamera, prvwrenderer.domElement);
prvwcontrols.enablePan = false;
prvwcontrols.enableZoom = false;
prvwcontrols.enableDamping = true;
prvwcontrols.dampingFactor = 0.04;
prvwcontrols.autoRotate = true;
prvwcontrols.update();

const ratio = +document.getElementById("right-sidebar").clientWidth;
prvwrenderer.setSize(ratio, ratio);
prvwcamera.aspect = ratio / ratio;
prvwcamera.updateProjectionMatrix();

const light = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light);
prvwscene.add(light.clone());
light.position.y = 10;

const pointlight = new THREE.PointLight(0xffffff, 1);
scene.add(pointlight);
pointlight.position.set(10, 15, 10);
prvwscene.add(pointlight.clone());
scene.add(pointlight);

const vertices = [];
for ( let i = 0; i < 10000; i ++ ) {

	const x = THREE.MathUtils.randFloatSpread(2000);
	const y = THREE.MathUtils.randFloatSpread(2000);
	const z = THREE.MathUtils.randFloatSpread(2000);

	if (x*x + y*y + z*z >= 20000){
		vertices.push( x, y, z );
	}
}

const startexture = new THREE.TextureLoader().load("https://threejs.org/examples/textures/sprites/disc.png");
const starmaterial = new THREE.PointsMaterial( { map: startexture, } );

const stargeometry = new THREE.BufferGeometry();
stargeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

const points = new THREE.Points( stargeometry, starmaterial );
scene.add( points );

const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(1000, 1000),
	new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0})
)
plane.name = "plane";
scene.add(plane);
plane.rotation.x += Math.PI / 2



function GetMesh(name, isghost){
	const texture = new THREE.TextureLoader().load(planetinfo.get(name).texture);
	let opacity = 1;
	let transparent = false
	if (isghost){opacity = 0.3; transparent = true}
	return new THREE.Mesh(new THREE.SphereGeometry(planetinfo.get(name).radius, 50, 50), new THREE.MeshLambertMaterial( {
		map: texture,
		transparent: transparent,
		opacity: opacity
	}))
}

export class Planet {	
	constructor(name, vector3) {
		this.info = {}
		Object.assign(this.info, planetinfo.get(name))

		this.m = this.info.mass;
		this.r = this.info.radius;

		this.x = vector3.x;
		this.y = vector3.y;
		this.z = vector3.z;
		this.vx = 0.0;
		this.vy = 0.0;
		this.vz = 0.0;

		this.mesh = GetMesh(name, false);
		scene.add(this.mesh);
		this.mesh.position.copy(ghostpos);
		this.mesh.name = planetid;

		this.trailmesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.01, 4, 4), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3}), 10000);
		scene.add(this.trailmesh);
		this.trailinstances = 0;

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


	if (planet1.r + planet2.r >= Math.pow(dx*dx + dy*dy + dz*dz, 0.5)){
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

function MovePlanets(){
	for (let i = 0; i < planets.length - 1; i++){
		for (let j = i + 1; j < planets.length; j++){
			SimPhysics(5000, planets[i], planets[j])
		};
	};

	for (let i = 0; i < planets.length; i++){
		planets[i].mesh.position.x = planets[i].x;
		planets[i].mesh.position.y = planets[i].y;
		planets[i].mesh.position.z = planets[i].z;
	};
}

function HandleGhost(){
	if (currentpressed && overcanvas) {
		if (currentghostmesh == null){currentghostmesh = GetMesh(currentpressed, true)}
		scene.add(currentghostmesh);
		currentghostmesh.position.copy(ghostpos);
	} else{
		scene.remove(currentghostmesh)
	}
}

function UpdateTrail(){
	for (let i = 0; i < planets.length; i++){
		const bufferobj = new THREE.Object3D();
		bufferobj.position.copy(planets[i].mesh.position)
		bufferobj.updateMatrix();
		planets[i].trailmesh.setMatrixAt(planets[i].trailinstances % 10000, bufferobj.matrix);
		planets[i].trailmesh.instanceMatrix.needsUpdate = true;
		planets[i].trailinstances += 1
	}
}

function ChangePrvwScene(){
	if (prvwscene.children.length != 2){
		prvwscene.remove(prvwscene.children[2])
	};
	const meshclone = currentselected.mesh.clone();
	meshclone.position.set(0, 0, 0);
	prvwscene.add(meshclone)
	prvwcamera.position.set(currentselected.r * 3, 0, 0);
	prvwcontrols.minDistance = currentselected.r * 3;
	prvwcontrols.maxDistance = currentselected.r * 3;
	prvwcontrols.update()
}

function ChangeTableInfo(){
	tbl.innerHTML = ""

	const namerow = document.createElement("tr");
	namerow.className = "property-node"

	const namecell = document.createElement("td");
	namecell.colSpan = "2";

	const name = document.createTextNode(currentselected.info.name);

	namecell.appendChild(name);
	namerow.appendChild(namecell);
	tbl.appendChild(namerow);


	const massrow = document.createElement("tr");
	massrow.className = "property-node"

	const massproperty = document.createElement("td");
	massproperty.appendChild(document.createTextNode("масса"));
	
	const massinfo = document.createElement("td");
	massinfo.appendChild(document.createTextNode(currentselected.info.mass + " M⊕"));

	massrow.appendChild(massproperty);
	massrow.appendChild(massinfo);
	tbl.appendChild(massrow);

	const radiusrow = document.createElement("tr");
	radiusrow.className = "property-node"

	const radiusproperty = document.createElement("td");
	radiusproperty.appendChild(document.createTextNode("радиус"));
	
	const radiusinfo = document.createElement("td");
	radiusinfo.appendChild(document.createTextNode((currentselected.info.radius * 1000).toFixed(1) + " км"));

	radiusrow.appendChild(radiusproperty);
	radiusrow.appendChild(radiusinfo);
	tbl.appendChild(radiusrow);


	const descrow = document.createElement("tr");
	descrow.className = "description-node"

	const desccell = document.createElement("td");
	desccell.colSpan = "2";

	const desc = document.createTextNode(currentselected.info.description);

	desccell.appendChild(desc);
	descrow.appendChild(desccell);
	tbl.appendChild(descrow);
}

function SelectObject(object){
	if (object != currentselected){
        currentselected = object;
		ChangePrvwScene();
		ChangeCameraTarget();
		ChangeTableInfo();
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
		y: currentselected.mesh.position.y + 10,
		z: currentselected.mesh.position.z + 10,
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

		prevposition.copy(currentselected.mesh.position);
	}
}

canvas.onclick = function(){
	if (currentover){
		SelectObject(currentover)
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

canvas.onmouseup = function(){
	if (currentpressed){
		scene.remove(currentghostmesh);
		currentghostmesh = null
		new Planet(currentpressed, ghostpos);
	}
    currentpressed = null;
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

function Animate(t) {
	requestAnimationFrame( Animate );

	HandleGhost();
	UpdateTrail();
	MovePlanets();
	ChangeCameraPosition();
	
	TWEEN.update(t);

	renderer.clear(); 
	renderer.render( scene, camera );
	renderer.clearDepth();
	prvwrenderer.render(prvwscene, prvwcamera)
	
	controls.update();
	prvwcontrols.update();
}

Animate();