#pragma strict

static var maxTime : float = 12;
static var startTime : float = 5;
static var timeRemaining = startTime;
static var initialTimeIncrement : float = 1.0;
static var timeIncrement = initialTimeIncrement;
static var timeIncrementDecay = 0.25;

private var poleTop = 4.5;
private var poleBottom = -2.5;

var timedIsland : Island;
static var s_timedIsland : Island;

var lightningRod : LightningRod;
static var s_lightningRod : LightningRod;

static var s_instance : RingTimer;

private static var lastResetTime : float;

function Start() {
	s_timedIsland = timedIsland;
	s_lightningRod = lightningRod;
	s_instance = this;
	lastResetTime = -1;
}

function Update () {
	if (GameController.activeIsland == timedIsland && !timedIsland.isPaused()) {

		if (Time.time - lastResetTime < 1.0) {
			var animationSpeed = 0.2;
		} else {
			animationSpeed = 1; //Snap to position immediately
			timeRemaining = Mathf.Clamp(timeRemaining-Time.deltaTime, 0, maxTime);
		}

		var currentPosition = transform.localPosition.y;
		var timeRatio = timeRemaining/maxTime;
		var desiredPosition = poleBottom + timeRatio * (poleTop - poleBottom);
		transform.localPosition.y = Mathf.Lerp(currentPosition, desiredPosition, animationSpeed);
	
		for (var ring : Transform in transform) {
			ring.renderer.material.color = GenFractionalColor(1-timeRatio);
		}

		if (timeRemaining <= 0) {
			timedIsland.handleTimedGameOver();
		}
	}
}

// Expects a number between 0 and 1
static function GenFractionalColor(fraction : float) {
	var adjusted_frac : float;
	if (fraction > 2.0/3) { //red down to yellow
		adjusted_frac = (fraction - 2.0/3)*3;
		return new Color(1, 1-adjusted_frac, 0, .75);
	} else if (fraction > 1.0/3) { //yellow down to green
		adjusted_frac = (fraction - 1.0/3)*3;
		return new Color(adjusted_frac, 1, 0, .75);
	} else { //green to blue
		adjusted_frac = fraction*3;
		return new Color(0, 1, 1-adjusted_frac, .75);
	}
}

static function addTime() {
	timeRemaining += timeIncrement;

	if (timeRemaining > maxTime) {
		increaseBase();
	}

}

static function increaseBase() {
	timeRemaining = startTime;
	
	//Create sparks to the rings
	for (var ring : Transform in s_instance.transform) {
		s_lightningRod.generateSpark(ring, 0.3);
	}

	//Increase the base value of the board
	var lowTiles = s_timedIsland.boards[0].doubleSpawnTileValue();

	for (var tile : Tile in lowTiles) {
		s_lightningRod.generateSpark(tile.transform, 0.6);
	}

	//switch animation to resetting
	lastResetTime = Time.time;

	timeIncrement = Mathf.Max(0.1, timeIncrement-timeIncrementDecay);
}

static function handleIslandReset() {
	timeRemaining = startTime;
	timeIncrement = initialTimeIncrement;
}
