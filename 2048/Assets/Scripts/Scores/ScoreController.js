#pragma strict

static function addPoints(numPoints : int) {
	GameController.activeIsland.getScoreBoard().addPoints(numPoints);
}

static function generateScoreBonus(mergedPointTotal : int) {
	GameController.activeIsland.getScoreBoard().generateScoreBonus(mergedPointTotal);
} 

static function getCurrentScore() {
	return GameController.activeIsland.getScoreBoard().getCurrentScore();
}

static function getScoreColor(num : float) {
	var adjustedNum = num * 2048.0 / 20480.0;
	return TileColors.getColor(adjustedNum);
}