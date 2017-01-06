var scene, camera, renderer;

function init (numBoids) {
	//set the scene

	scene = new THREE.Scene();
	var screenWidth = window.innerWidth, screenHeight = window.innerHeight;
	var viewAngle = 45, aspect = screenWidth / screenHeight, near = 0.1, far = 10000;
	camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);


	camera.lookAt(scene.position);
	renderer = new THREE.WebGLRenderer( {
		antialias: true,
		alpha: true
	});

	renderer.setSize(screenWidth, screenHeight);
	var container = document.body;
	container.appendChild(renderer.domElement);

	// var sky = MakeSkybox();
	// scene.add(sky);

	for (var i = 0; i < numBoids; i++) {
		var boid = new Boid();
		//add the new boid to the list

		//add the mesh to the scene
		scene.add(boid.mesh);
	};

	scene.add(camera);

	animate();
}

function animate() {
	requestAnimationFrame(animate);
	//perform animation functions over all boids + update camera position
	for (boid in boidList) {
		boid.update(boidList);
	}

	renderer.render(scene, camera);
}

function updatePosition(neighborList) {
	//perform the boids algorithm here
	//with credit for this algorithm to: http://www.vergenet.net/~conrad/boids/pseudocode.html
	var v1 = rule1(this.mesh, neighborList);
	var v2 = rule2(this.mesh);
	var v3 = rule3(this.mesh);

	this.velocity = this.velocity + v1 + v2 + v3;
	this.mesh.position = this.position + this.velocity;

}
function rule1(mesh, neighbors) {
	var vector = new THREE.vector3(0,0,0);
	var nearby = 0;
	for (boid in neighbors) {
		if (boid.mesh != mesh && 
			abs(boid.position - mesh.position) < neighborhood) {
			vector += boid.position;
		nearby += 1;
		}
	}
	vector = vector / nearby;
	return (vector - self.position) / THREE.vector3(100);
}


function getPosition() {
	return this.mesh.position;
}
function getHeading() {
	//use self.mesh.rotation to determine a heading?
	return normalize(this.velocity);
}

function Boid(initVelocity, initPosition) {
	this.mesh = new THREE.Mesh(boidGeom(), boidMat());
	this.mesh.position = initPosition;
	// this.mesh.rotation = initRotation;
	this.velocity = initVelocity;
	this.position = getPosition;
	this.heading = getHeading;
	this.update = updatePosition;

}