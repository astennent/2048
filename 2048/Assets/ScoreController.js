#pragma strict

var scoreBonusPrefab : ScoreBonus;

class ScoreController extends MonoBehaviour {

	private static var currentScore = 0;
	private static var displayScore = 0;
	private static var topScore = 0;

	static function Initialize() {
		topScore = fetchTopScore();
	}

	static function fetchTopScore() {
		//TODO: Retrieve from filesystem
		return 0;
	}

	static function setTopScore(numPoints : int) {
		topScore = numPoints;
		//TODO: Save in filesystem
	}

	static function addPoints(numPoints : int) {
		currentScore += numPoints;
		if (currentScore > topScore) {
			setTopScore(currentScore);
		}
		print(currentScore);
	}

	static function resetScore() {
		currentScore = 0;
		displayScore = 0;
	}

}