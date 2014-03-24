#pragma strict

private var defaultRotation : Quaternion;
private var upRotation : Quaternion;
private var downRotation : Quaternion;
private var leftRotation : Quaternion;
private var rightRotation : Quaternion;
private var desiredRotation : Quaternion;

private var nudgeTime : float;

function Start() {
	defaultRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.right, 5);
	upRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.right, -10);
	downRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.right, 5);

	transform.RotateAround(transform.position, Vector3.up, 5);
	leftRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.up, -10);
	rightRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.up, 5);

	desiredRotation = defaultRotation;
}

function Update() {
	if (Time.time - nudgeTime > .2) {
		desiredRotation = defaultRotation;
	}
	transform.rotation = Quaternion.Lerp(transform.rotation, desiredRotation, 0.3);
}

function nudge(direction : int) {
	nudgeTime = Time.time;
	switch (direction) {
		case Board.UP:
			desiredRotation = upRotation;
			break;
		case Board.DOWN:
			desiredRotation = downRotation;
			break;
		case Board.LEFT:
			desiredRotation = leftRotation;
			break;
		case Board.RIGHT:
			desiredRotation = rightRotation;
			break;
		break;

	}
}