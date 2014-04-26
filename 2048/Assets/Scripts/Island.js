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

	var madeMove = false;
	for (var board in boards) {
		if (board.onMove(direction)) {
			madeMove = true;
		}
	}

	//Notify frozen boards if the move was successful
	if (madeMove) {
		for (var board in boards) {
			board.decrementResetCounter();
		}
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

function handleGameOver() {
	pause();
	print("Handling game over");
}

function restartIsland() {
	for (var board in boards) {
		board.resetSpawnTileValue();
		board.resetTiles();
	}
	gameOver = false;
	paused = false;
	ScoreController.reset();
}
