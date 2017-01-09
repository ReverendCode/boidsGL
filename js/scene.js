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
	camera.position.set(0,0,100);
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

function updatePosition(neighbors) {
	var vec1 = new THREE.Vector3();
	var vec2 = new THREE.Vector3();
	var vec3 = new THREE.Vector3();
	var accum = 0;
	for (i in boidList) {
		if (this.mesh != boidList[i].mesh &&
		 this.mesh.position.distanceTo(boidList[i].mesh.position) < 20) {
		// if (this.mesh != boidList[i].mesh) {
			accum++;
			// Rule 1:
			vec1 = vec1.add(boidList[i].mesh.position);
			// Rule 2:
			var diff = new THREE.Vector3();
			if (this.mesh.position.distanceTo(boidList[i].mesh.position) < 10) {
				diff.subVectors(boidList[i].mesh.position, this.mesh.position);
				vec2 = vec2.sub(diff);

				// vec2 = vec2.sub(boidList[i].mesh.position.sub(this.mesh.position));
			}
			// Rule 3:
			vec3 = vec3.add(boidList[i].velocity);
		}
	}
	var temp = new THREE.Vector3();
	if (accum > 0) {
		vec1 = vec1.divideScalar(accum);
		vec1 = vec1.sub(this.mesh.position);
		vec1 = vec1.divideScalar(100); //Magic numbers
		temp = temp.add(vec1);

		vec3 = vec3.divideScalar(accum);
		vec3 = vec3.sub(this.velocity);
		vec3 = vec3.divideScalar(8); //Magic numbers
		temp = temp.add(vec3);

	} 
	temp = temp.add(vec2);
	this.velocity = this.velocity.add(temp);
	this.velocity.clampScalar(-1,1);

	// this.mesh.position = 
	this.mesh.position.add(this.velocity);
	//TODO: This needs to be generalized (get rid of magic numbers)
	if (this.mesh.position.y > 50) {
		this.mesh.position.y = -50;
	}
	if (this.mesh.position.y < -50) {
		this.mesh.position.y = 50;
	}

	if (this.mesh.position.x > 100) {
		this.mesh.position.x = -100;
	}
	if (this.mesh.position.x < -100) {
		this.mesh.position.x = 100;
	}
	this.mesh.position.z = 0;
}

function boidGeom() {
	return new THREE.ConeGeometry(1.5,3,16);
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