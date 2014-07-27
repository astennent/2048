#pragma strict

private var scoreBoard : ScoreBoard;

var boards = new List.<Board>();
var canRessurect = true;
var timed = false;
private var paused : boolean;
private var gameOver : boolean = true; //Game Over
var islandId : String;

// Used to add a pause after game over so the player can see what happened.
private var gameOverTime : float = 0.0;
private var delayingGameOver = false;

function isPaused() {
	return paused;
}
function togglePause() {
	if (paused) {
		unpause();
	} else {
		pause();
	}
}
function pause() {
	paused = true;
}
function unpause() {
	paused = false;
}

function isGameOver() {
	return gameOver;
}

function registerBoard(board : Board) {
	boards.Add(board);
}

function setScoreBoard(scoreBoard : ScoreBoard) {
	this.scoreBoard = scoreBoard;
}

function getScoreBoard() {
	return scoreBoard;
}


function onMove(direction : int) {

	//Don't respond to input if paused
	if (paused || gameOver) {
		return;
	}

	var mergedPointTotal = 0;

	var madeMove = false;
	for (var board in boards) {
		if (board.onMove(direction)) {
			madeMove = true;
			mergedPointTotal += board.getMergedPointTotal();
		}
	}

	if (mergedPointTotal != 0) {
		ScoreController.generateScoreBonus(mergedPointTotal);
	}

	if (madeMove) {
		UpdateVariants();
	}

	//Check if the game is over
	gameOver = true;
	for (var board in boards) {
		if (!board.isLost()) {
			gameOver = false;
		}
	}
	if (gameOver) {
		handleGameOver();
	}

	//TODO: Handle win?
}

function UpdateVariants() {
	for (var board in boards) {
		board.decrementResetCounter();
	}

	if (timed) {
		RingTimer.addTime();
	}
}

function handleGameOver() {
	gameOver = true;
	if (!delayingGameOver) {
		gameOverTime = Time.time;
		delayingGameOver = true;
		for (var board in boards) {
			board.handleBoardLost();
		}
	}

}
function Update() {
	if (delayingGameOver && gameOver && Time.time - gameOverTime > 1.0) {
		delayingGameOver = false;
		pause();
	}	
}

function OnGUI() {
	if (delayingGameOver) {
		var screenCoveringRect = new Rect(-1, -1, Screen.width+2, Screen.height+2);
		var oldAlpha = GUI.color.a;
		GUI.color.a = Mathf.Min(1.0, Time.time - gameOverTime);
		GUI.Box(screenCoveringRect, "");
		GUI.color.a = oldAlpha;
	}
}

function restartIsland() {
	for (var board in boards) {
		board.resetSpawnTileValue();
		board.resetTiles();
	}
	scoreBoard.reset();
	gameOver = false;
	paused = false;

	if (timed) {
		RingTimer.handleIslandReset();
	}
}
