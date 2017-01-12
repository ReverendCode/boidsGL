var scene, camera, renderer;
var MINDISTANCE = 10;
var boidList = [];

function init (numBoids) {
	//set the scene

	scene = new THREE.Scene();
	var screenWidth = window.innerWidth, screenHeight = window.innerHeight;
	var viewAngle = 45, aspect = screenWidth / screenHeight, near = 0.1, far = 10000;
	camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

	//TODO: this should probably look at the COM for the whole flock
	camera.position.set(0,0,200);
	camera.lookAt(scene.position);
	renderer = new THREE.WebGLRenderer( {
		antialias: true,
		alpha: true
	});

	renderer.setSize(screenWidth, screenHeight);
	var container = document.body;
	container.appendChild(renderer.domElement);

	var velocity = new THREE.Vector3(1,0,0);
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

	renderer.render(scene, camera);
}

function ruleOne(neighbors, me) {
	var vec1 = new THREE.Vector3();
	var accum = 0;
	for (i in neighbors) {
		if (me.mesh != neighbors[i].mesh && 
			me.mesh.position.distanceTo(neighbors[i].mesh.position) < 200) {
			accum++;
			vec1.add(neighbors[i].mesh.position);
		}
	}
	vec1.divideScalar(accum);
	return vec1.sub(me.mesh.position).divideScalar(200);
}

function ruleTwo(neighbors, me) {
	var pushBack = new THREE.Vector3();
	var temp = new THREE.Vector3();
	for (i in neighbors) {
			if (me.mesh != neighbors[i].mesh) {
				temp.subVectors(me.mesh.position, neighbors[i].mesh.position);

				if (Math.abs(temp.length()) < 10) {
					pushBack.add(temp);
				}
			}
	}
	return pushBack;
}

function ruleThree(neighbors, me) {
	var velocity = new THREE.Vector3();
	var accum = 0;
	for (i in neighbors) {
				if (me.mesh != neighbors[i].mesh && 
			me.mesh.position.distanceTo(neighbors[i].mesh.position) < 200) {
					accum++;
					velocity.add(neighbors[i].velocity);
				}
	}
	velocity.divideScalar(accum);
	velocity.sub(me.velocity);
	return velocity.divideScalar(10);
}

function updatePosition(neighbors) {
	var vec1 = ruleOne(neighbors, this);
	var vec2 = ruleTwo(neighbors, this);
	var vec3 = ruleThree(neighbors, this);


	this.velocity.add(vec1);
	this.velocity.add(vec2);
	this.velocity.add(vec3);
	this.velocity.add(bound(this));

	this.velocity.clampLength(-1,1);

	
	this.mesh.position.add(this.velocity);
	this.mesh.position.setZ(0);
	

}

function bound(boid) {
	var distance = .5;
	var xMin = -75;
	var xMax = 75;
	var yMin = -75;
	var yMax = 75;
	var vector = new THREE.Vector3();
	if (boid.mesh.position.x < xMin) {
		vector.x = distance;;
	}
	else if (boid.mesh.position.x > xMax) {
		vector.x = -distance;;
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