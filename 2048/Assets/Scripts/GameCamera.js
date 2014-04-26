#pragma strict

private var defaultRotation : Quaternion;
private var defaultPosition : Vector3;
private var upRotation : Quaternion;
private var upPosition : Vector3;
private var downRotation : Quaternion;
private var downPosition : Vector3;
private var leftRotation : Quaternion;
private var leftPosition : Vector3;
private var rightRotation : Quaternion;
private var rightPosition : Vector3;
private var desiredRotation : Quaternion;
private var desiredPosition : Vector3;

private var nudgeTime : float;
private var nudgeDistance : float = -5;

//Tracks the game state by observing the GameController's current island
private var transitioning = true;
private var prevIsland : Island;

// Camera points at this when it is spinning
var islandsAnchor : Transform;

function Update() {

	// Check if a transition must be made.
	if (GameController.activeIsland != prevIsland) {
		prevIsland = GameController.activeIsland;
		transitioning = true;
		if (prevIsland != null) {
			transform.parent = prevIsland.transform;
		}
	}

	var playing = (GameController.activeIsland != null);

	if (transitioning) {
		UpdateTransitioning(playing);
	} else {
		UpdateNormal(playing);
	}
}

function UpdateNormal(playing : boolean) {
	if (playing) {
		if (Time.time - nudgeTime > .2) {
			desiredRotation = defaultRotation;
			desiredPosition = defaultPosition;
		}

		transform.rotation = Quaternion.Lerp(transform.rotation, desiredRotation, 0.3);
		transform.position = Vector3.Lerp(transform.position, desiredPosition, 0.3);
	} else {
		transform.RotateAround(islandsAnchor.transform.position, Vector3.up, -0.1);
		transform.LookAt(islandsAnchor.transform.position);
	}
}

function UpdateTransitioning(playing : boolean) {
	if (playing) {
		var rotationTarget = GameController.activeIsland.transform.position;
		desiredPosition = new Vector3(0, -0.3, -9.3); //backed away from the island
	} else {
		rotationTarget = islandsAnchor.position;
		desiredPosition = new Vector3(0, 40, -30); //above and to the side of the islands.
	}

	var oldRotation = transform.rotation;
	transform.LookAt(rotationTarget);
	transform.rotation = Quaternion.Lerp(oldRotation, transform.rotation, 0.5);
	transform.localPosition = Vector3.Lerp(transform.localPosition, desiredPosition, 0.2);

	if (Vector3.Distance(transform.localPosition, desiredPosition) < 0.1) {
		transform.LookAt(rotationTarget);
		transitioning = false;

		if (playing) {
			resetNudgePositions();
		}

	}
}

function resetNudgePositions() {
	defaultRotation = transform.rotation;
	defaultPosition = transform.position;
	var target  = GameController.activeIsland.transform.position;

	var rightAxis = GameController.activeIsland.transform.right;
	var upAxis = GameController.activeIsland.transform.up;

	transform.RotateAround(target, rightAxis, nudgeDistance);
	upRotation = transform.rotation;
	upPosition = transform.position;

	transform.RotateAround(target, rightAxis, -2 * nudgeDistance);
	downRotation = transform.rotation;
	downPosition = transform.position;

	transform.RotateAround(target, rightAxis, nudgeDistance);

	transform.RotateAround(target, upAxis, nudgeDistance);
	leftRotation = transform.rotation;
	leftPosition = transform.position;

	transform.RotateAround(target,upAxis, -2 * nudgeDistance);
	rightRotation = transform.rotation;
	rightPosition = transform.position;

	transform.RotateAround(target, upAxis, nudgeDistance);

	desiredRotation = defaultRotation;
	desiredPosition = defaultPosition;
}

function nudge(direction : int) {
	if (direction != Board.NONE) {
		nudgeTime = Time.time;
	}
	switch (direction) {
		case Board.UP:
			desiredRotation = upRotation;
			desiredPosition = upPosition;
			break;
		case Board.DOWN:
			desiredRotation = downRotation;
			desiredPosition = downPosition;
			break;
		case Board.LEFT:
			desiredRotation = leftRotation;
			desiredPosition = leftPosition;
			break;
		case Board.RIGHT:
			desiredRotation = rightRotation;
			desiredPosition = rightPosition;
			break;
		default: break;

	}
}