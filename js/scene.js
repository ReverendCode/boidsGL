var scene, camera, renderer;
var MINDISTANCE = 10;
var boidList = [];


// Constants live here:

var boidRange = 100;
var maxSpeed = 2;
var personalBubble = 20;
var border = 200;

// toggles for rules (as needed)
var r1 = 1;

function checkKey(e) {
    e = e || window.event;
    alert(e.keyCode);
    console.log(e.keyCode);
}

function handleKeyUp(key) {
	key = key || window.event;
	if (key.keyCode == 68) {
		console.log("combine");
		r1 = 1;
	}
}

function handleKeyDown(key) {
	key = key || window.event;
	if (key.keyCode == 68) {
		console.log("disperse");
		r1 = 0;
	}
}

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function init (numBoids) {
	//set the scene

	scene = new THREE.Scene();
	var screenWidth = window.innerWidth, screenHeight = window.innerHeight;
	var viewAngle = 45, aspect = screenWidth / screenHeight, near = 0.1, far = 10000;
	camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

	//TODO: this should probably look at the COM for the whole flock
	camera.position.set(0,0,500);
	camera.lookAt(scene.position);
	renderer = new THREE.WebGLRenderer( {
		antialias: true,
		alpha: true
	});

	renderer.setSize(screenWidth, screenHeight);
	var container = document.body;
	container.appendChild(renderer.domElement);

	var velocity = new THREE.Vector3(0,4,10);
	var pos = new THREE.Vector3(0,0,0);

	for (var i = 0; i < numBoids; i++) {
		var boid = new Boid(velocity, pos);
		//add the new boid to the list
		boidList.push(boid)
		//add the mesh to the scene
		scene.add(boid.mesh);
	};

	scene.add(camera);

	animate();
}

function animate() {
	requestAnimationFrame(animate);
	//perform animation functions over all boids + update camera position
	for (boid in boidList) { //I am annoyed that this is so close to pythonic syntax, 
		boidList[boid].update(boidList); // but not quite there.
	}

	//update camera here.
	// camera.lookAt(COM(boidList));

	renderer.render(scene, camera);
}

function COM(neighbors) {
	var vector = new THREE.Vector3();
	var accum = 0;
	for (i in neighbors) {
		accum++;
		vector.add(neighbors[i].mesh.position);
	}
	vector.divideScalar(accum);

	return vector;
}

function ruleOne(neighbors, me) {
	var vec1 = new THREE.Vector3();
	var accum = 0;
	for (i in neighbors) {
		if (me.mesh != neighbors[i].mesh && 
			me.mesh.position.distanceTo(neighbors[i].mesh.position) < boidRange) {
			accum++;
			vec1.add(neighbors[i].mesh.position);
		}
	}
	vec1.divideScalar(accum);
	return vec1.sub(me.mesh.position).divideScalar(100);
}

function ruleTwo(neighbors, me) {
	var pushBack = new THREE.Vector3();
	var temp = new THREE.Vector3();
	for (i in neighbors) {
			if (me.mesh != neighbors[i].mesh) {
				temp.subVectors(me.mesh.position, neighbors[i].mesh.position);

				if (Math.abs(temp.length()) < personalBubble) {
					pushBack.add(temp);
				}
			}
	}
	return pushBack.divideScalar(1);
}

function ruleThree(neighbors, me) {
	var velocity = new THREE.Vector3();
	var accum = 0;
	for (i in neighbors) {
				if (me.mesh != neighbors[i].mesh && 
			me.mesh.position.distanceTo(neighbors[i].mesh.position) < boidRange) {
					accum++;
					velocity.add(neighbors[i].velocity);
				}
	}
	velocity.divideScalar(accum);
	velocity.sub(me.velocity);
	return velocity.divideScalar(25);
}

function updatePosition(neighbors) {
	// Three basic rules for emergent flocking behavior
	var vec1 = ruleOne(neighbors, this);
	var vec2 = ruleTwo(neighbors, this);
	var vec3 = ruleThree(neighbors, this);


	this.velocity.add(vec1.multiplyScalar(r1));
	this.velocity.add(vec2);
	this.velocity.add(vec3);
	this.velocity.add(bound(this));

	this.velocity.clampLength(-maxSpeed,maxSpeed);

	
	this.mesh.position.add(this.velocity);
	// this.mesh.position.setZ(0);
	

}

function bound(boid) {
	var distance = .5;
	var xMin = -border;
	var xMax = border;
	var yMin = -border;
	var yMax = border;
	var vector = new THREE.Vector3();
	if (boid.mesh.position.x < xMin) {
		vector.x = distance;
	}
	else if (boid.mesh.position.x > xMax) {
		vector.x = -distance;
	}
	if (boid.mesh.position.y < yMin) {
		vector.y = distance;
	}
	else if (boid.mesh.position.y > yMax) {
		vector.y = -distance;
	}
	return vector;
}

function boidGeom() {
	return new THREE.ConeGeometry(1,4,16);
}

function boidMat() {
	return new THREE.MeshBasicMaterial( {color: 0xff0000} );
}

function Boid(initVelocity, initPosition) {
	this.mesh = new THREE.Mesh(boidGeom(), boidMat());
	var rNum = Math.random() * 100;
	this.mesh.position.set(rNum,rNum,0);
	this.velocity = initVelocity;
	this.update = updatePosition;

}