#pragma strict

private var scoreBoard : ScoreBoard;

var boards = new List.<Board>();

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
	var madeMove = false;
	for (var board in boards) {
		if (board.onMove(direction)) {
			madeMove = true;
		}
	}
	if (madeMove) {
		for (var board in boards) {
			board.decrementResetCounter();
		}
	}
}

function resetTiles() {
	for (var board in boards) {
		board.resetTiles();
	}
}
