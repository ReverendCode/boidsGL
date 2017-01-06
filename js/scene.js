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
var velocity = new THREE.Vector3(5);
var pos = new THREE.Vector3(0,0,-20);
var boid = new Boid(velocity,pos);
boidList.push(boid);
boid.mesh.position.set(0,0,-200);
scene.add(boid.mesh);


	// for (var i = 0; i < numBoids; i++) {
	// 	var boid = new Boid();
	// 	//add the new boid to the list
	// 	boidList.push(boid)
	// 	//add the mesh to the scene
	// 	scene.add(boid.mesh);
	// };

	scene.add(camera);

	animate();
}

function animate() {
	requestAnimationFrame(animate);
	//perform animation functions over all boids + update camera position
	for (boid in boidList) {
		// boid.update(boidList);
		boidList[boid].update(boidList);
	}

	renderer.render(scene, camera);
}

function updatePosition(neighbors) {
//with credit for this algorithm to: http://www.vergenet.net/~conrad/boids/pseudocode.html
	var rule1Vector = new THREE.Vector3();
	var rule2Vector = new THREE.Vector3();
	var rule3Vector = new THREE.Vector3();
	var nearby = 1;
	var distance;
	var boid;
	//TODO: consider speeding this up if needed with a sorted list?
	for (foo in neighbors) {
		boid = neighbors[foo];
		distance = boid.mesh.position.distanceTo(this.mesh.position);
	if (boid.mesh != this.mesh) {
		if (distance < neighborhood) {
			//collect nearby positions for averaging
			rule1Vector += boid.position;
			nearby += 1;
			//check for rule 2:
			if (distance < MINDISTANCE) {
				rule2Vector -= (boid.mesh.position - this.mesh.position);
			}
			//apply rule 3:
			rule3Vector += boid.velocity;
		}
	}
}
	rule1Vector = rule1Vector / nearby; //get the average
	rule1Vector = (rule1Vector - self.position) / 100; // take %1 of the resulting vector

	rule3Vector = rule3Vector / nearby;
	rule3Vector = (rule3Vector - this.velocity) / 8;

	console.log(this.velocity.x);
	this.velocity = this.velocity + rule1Vector + rule2Vector + rule3Vector;
	this.mesh.position = this.position + this.velocity;
	
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
	return new THREE.MeshBasicMaterial( {color: 0xfff000} );
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