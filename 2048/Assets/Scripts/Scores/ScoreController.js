#pragma strict

static var activeScoreBoard : ScoreBoard;

static function invalidate() {
	var activeIsland = GameController.activeIsland;
	if (activeIsland) {
		activeScoreBoard = activeIsland.getScoreBoard();
		activeScoreBoard.Initialize();
	} else {
		activeScoreBoard = null;
	}
}

static function addPoints(numPoints : int) {
	activeScoreBoard.addPoints(numPoints);
}

static function generateScoreBonus(mergedPointTotal : int) {
	activeScoreBoard.generateScoreBonus(mergedPointTotal);
} 

static function getCurrentScore() {
	return activeScoreBoard.getCurrentScore();
}


static function getScoreColor(num : float) {
	var adjustedNum = num * 2048.0 / 20480.0;
	return TileColors.getColor(adjustedNum);
}