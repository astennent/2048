#pragma strict

static var tiltSpeed = .1;
private var tilt : float = 0;

function Update () {
	var forwardAcceleration = InputController.getLeftYAxis() * Time.deltaTime;
	var rightAcceleration = InputController.getLeftXAxis() * Time.deltaTime;
	transform.position += transform.forward * forwardAcceleration;
	transform.position += transform.right * rightAcceleration;

	tilt += rightAcceleration * tiltSpeed;
	transform.RotateAround(transform.forward, tilt);

	tilt = Mathf.Lerp(tilt, 0, .2);
}