#pragma strict

var lifetime : float;
var startTime : float;

private static var SIZE_ADJUST = .02;

private var from : Transform;
private var to : Transform;

function initialize(from : Transform, to : Transform, duration : float) {
	
	startTime = Time.time;
	lifetime = duration;

	this.from = from;
	this.to = to;

	UpdatePosition();
}

function Update() {

	if (Time.time - startTime > lifetime) {
		Destroy(gameObject);
	}

	UpdatePosition();
}

function UpdatePosition() {
	var center = (from.position + to.position) / 2;
	transform.position = center;
	transform.localScale.x = Vector3.Distance(from.position, to.position)*.024;
	transform.localScale.y = transform.localScale.x * 1;
	transform.localScale.z = transform.localScale.x * 1;
	transform.LookAt(to);
	transform.Rotate(0,90,0);
}