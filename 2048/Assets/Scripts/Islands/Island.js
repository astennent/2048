#pragma strict

private var scoreBoard : ScoreBoard;

var boards = new List.<Board>();
var canRessurect = true;
private var paused : boolean;
private var gameOver : boolean = true; //Game Over
var islandId : String;

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
	if (paused) {
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

	RingTimer.addTime();
}

function handleGameOver() {
	pause();
}

function handleTimedGameOver() {
	for (var board in boards) {
		board.handleBoardLost();
	}
	handleGameOver();
}

function restartIsland() {
	for (var board in boards) {
		board.resetSpawnTileValue();
		board.resetTiles();
	}
	scoreBoard.reset();
	gameOver = false;
	paused = false;

	RingTimer.notifyIslandReset(this);
}
