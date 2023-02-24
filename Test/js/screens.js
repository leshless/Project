const GRAVITY = 6.67 * Math.pow(10, -11); // Гравитационная постоянная

function GetAcceleration(m, dx, dy, dz) {
    const r = Math.pow(dx*dx + dy*dy + dz*dz, 1.5); // Расчет полного радиус-вектора из трех измерений расстояния двух объектов
    return GRAVITY * m / r  // Функция возвращает ускорение тела по формуле
}

function SimPhysics(dt, planet1, planet2){
	const [dx, dy, dz] = [planet1.x - planet2.x, planet1.y - planet2.y, planet1.z - planet2.z]; // Расчет расстояний по осям x, y, z

    const A1 = GetAcceleration(planet2.m, dx, dy, dz); // Ускорения, действующие на тела
    const A2 = GetAcceleration(planet1.m, dx, dy, dz);                                              

   	const [p2ax, p2ay, p2az] = [dx * A2, dy * A2, dz * A2]; 
   	const [p1ax, p1ay, p1az] = [-dx * A1, -dy * A1, -dz * A1];

   	planet2.vx += p2ax * dt; // Изменение соответствующих параметров:
	planet2.vy += p2ay * dt; // скорость
	planet2.vz += p2az * dt;

	planet1.vx += p1ax * dt;
	planet1.vy += p1ay * dt; // расстояние
	planet1.vz += p1az * dt;
}

let earthinfo = { // объект из библиотеки планет с физическими параметрами Земли
    name: "earth",
    mass: 6 * Math.pow(10, 24), 
    radius: 6371 * Math.pow(10, 3),
}

class Planet {
	constructor(name, vector3) { // конструктор создания нового объекта типа "Planet"
		this.info = {}
		Object.assign(this.info, planetinfo.get(name)) // присвоение параметров из библиотеки планет

		this.m = this.info.mass;
		this.r = this.info.radius;

		this.x = vector3.x; // присвоение положения в пространстве, выбранного пользователем
		this.y = vector3.y;
		this.z = vector3.z;
		this.vx = 0.0;
		this.vy = 0.0;
		this.vz = 0.0;

		this.mesh = GetMesh(name); // получение 3D модели данного объекта
		scene.add(this.mesh); // добавление 3D модели на сцену
	}
}
