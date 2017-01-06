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
	var velocity = 5;
	var pos = new THREE.Vector3(0,0,-200);

// var boid = new Boid(velocity,pos);
// boidList.push(boid);
// boid.mesh.position.set(0,0,-200);
// scene.add(boid.mesh);


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
	for (boid in boidList) {
		boidList[boid].update(boidList);
	}

	renderer.render(scene, camera);
}

function updatePosition(neighbors) {
//with credit for this algorithm to: http://www.vergenet.net/~conrad/boids/pseudocode.html
	this.mesh.translateY(0.8);
	this.mesh.rotation.z += .02;

	
}

function getPosition() {
	return this.mesh.position;
}
function getHeading() {
	//use self.mesh.rotation to determine a heading?
	return normalize(this.velocity);
}

function boidGeom() {
	return new THREE.ConeGeometry(5,20,32);
}

function boidMat() {
	return new THREE.MeshBasicMaterial( {color: 0xff0000} );
}

function Boid(initVelocity, initPosition) {
	this.mesh = new THREE.Mesh(boidGeom(), boidMat());
	this.mesh.position.set(0,0,-200);
	// console.log(initPosition);
	// this.mesh.position.set(initPosition);
	
	this.velocity = initVelocity;
	this.position = getPosition;
	this.heading = getHeading;
	this.update = updatePosition;

}