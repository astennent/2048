#pragma strict

private var defaultRotation : Quaternion;
private var upRotation : Quaternion;
private var downRotation : Quaternion;
private var leftRotation : Quaternion;
private var rightRotation : Quaternion;
private var desiredRotation : Quaternion;

private var nudgeTime : float;
private var nudgeDistance : float = 6;

function Start() {
	defaultRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.right, nudgeDistance);
	upRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.right, -2 * nudgeDistance);
	downRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.right, nudgeDistance);

	transform.RotateAround(transform.position, Vector3.up, nudgeDistance);
	leftRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.up, -2 * nudgeDistance);
	rightRotation = transform.rotation;

	transform.RotateAround(transform.position, Vector3.up, nudgeDistance);

	desiredRotation = defaultRotation;
}

function Update() {
	if (Time.time - nudgeTime > .2) {
		desiredRotation = defaultRotation;
	}
	transform.rotation = Quaternion.Lerp(transform.rotation, desiredRotation, 0.3);
}

function nudge(direction : int) {
	if (direction != Board.NONE) {
		nudgeTime = Time.time;
	}
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
		default: break;

	}
}