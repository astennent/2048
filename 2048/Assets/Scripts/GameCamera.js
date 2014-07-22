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
private var pauseAdjustY : float = .5;
private var pauseAdjustZ : float = -4;

private var nudgeTime : float;
private var nudgeDistance : float = -5;

//Tracks the game state by observing the GameController's current island
private var transitioning = true;
private var prevIsland : Island;

// Camera points at this when it is spinning
var islandsAnchor : Transform;

var menuStartPosition : Vector3;
var gameController : GameController;
private var mainMenu : MainMenu;

function Start() {
	prevIsland = gameController.classicIsland;
	mainMenu = gameController.GetComponent(MainMenu);
}

function Update() {

	// Check if a transition must be made.
	var curIsland = GameController.activeIsland;

	if (curIsland != prevIsland) {
		transitioning = true;
		if (curIsland == null) {
			transform.parent = null;
			menuStartPosition = new Vector3(-2*prevIsland.transform.position.x, 30, -2*prevIsland.transform.position.z);
		} else {
			transform.parent = curIsland.transform;
		}
		prevIsland = curIsland;
	}

	var playing = (curIsland != null);

	UpdateAnchorPosition(curIsland);
	if (mainMenu.showingAchievements) {
		UpdateForAchievementMenu();
	} else if (transitioning) {
		UpdateTransitioning(playing);
	} else {
		UpdateNormal(playing);
	}
}

function invalidate() {
	transitioning = true;
}

function UpdateNormal(playing : boolean) {
	if (playing) {

		if (GameController.activeIsland.isPaused() || Time.time - nudgeTime > .2) {
			desiredRotation = defaultRotation;
			desiredPosition = defaultPosition;

			// Adjust for pause menu if necessary
			if (GameController.activeIsland.isPaused()) {
				var pauseAdjust = transform.forward * pauseAdjustZ + transform.up * pauseAdjustY;
				desiredPosition += pauseAdjust;
			}

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

		//Adjust for pause menu if necessary
		if (GameController.activeIsland.isPaused()) {
			var pauseAdjust = Vector3.forward * pauseAdjustZ + Vector3.up * pauseAdjustY;
			desiredPosition += pauseAdjust;
		}

	} else {
		rotationTarget = islandsAnchor.position;
		desiredPosition = menuStartPosition;//new Vector3(0, 40, -30); //above and to the side of the islands.
	}

	transform.localPosition = Vector3.Lerp(transform.localPosition, desiredPosition, 0.2);
	transform.LookAt(rotationTarget);

	if (Vector3.Distance(transform.localPosition, desiredPosition) < 0.1) {
		transform.LookAt(rotationTarget);
		transitioning = false;

		if (playing) {
			if (GameController.activeIsland.isPaused()) {
				//reuse the pauseAdjust variable calculated above
				transform.localPosition -= pauseAdjust;
				resetNudgePositions();
				transform.localPosition += pauseAdjust;
			} else {
				resetNudgePositions();
			}
		}

	}
}

function UpdateForAchievementMenu() {
	var anchor = GameObject.FindGameObjectWithTag("CameraAnchor");
	desiredPosition = anchor.transform.position / 2;
	transform.localPosition = Vector3.Lerp(transform.localPosition, desiredPosition, 0.1);

	var oldRotation = transform.rotation;
	transform.LookAt(anchor.transform, GameObject.FindGameObjectWithTag("HighscoreBoard").transform.up);
	transform.rotation = Quaternion.Lerp(oldRotation, transform.rotation, 0.2);
}

function UpdateAnchorPosition(curIsland : Island) {
	var anchor = GameObject.FindGameObjectWithTag("CameraAnchor");
	var anchorDesiredPosition : Vector3;
	if (curIsland != null) {
		anchorDesiredPosition = curIsland.transform.position;
	} else {
		anchorDesiredPosition = (mainMenu.showingAchievements) ? Vector3.up * -15 : Vector3.zero;
	}
	anchor.transform.position = Vector3.Lerp(anchor.transform.position, anchorDesiredPosition, 0.17);
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