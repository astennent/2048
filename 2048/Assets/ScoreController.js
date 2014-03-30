#pragma strict

var scoreBonusPrefab : ScoreBonus;
var scoreLabel : TextMesh;
var topScoreLabel : TextMesh;

class ScoreController extends MonoBehaviour {

	static var currentScore = 0;
	private static var displayScore = 0;
	private static var topScore = 0;

	static var instance : ScoreController;

	function Start() {
		instance = GetComponent(ScoreController);
	}

	function Update() {
		if (displayScore < currentScore-20) {
			displayScore = Mathf.Lerp(displayScore, currentScore, 0.1);
		} else if (displayScore < currentScore) {
			displayScore++;
		} else {
			displayScore = currentScore;
		}
		scoreLabel.text = ""+displayScore;

		scoreLabel.color = getScoreColor(displayScore);
	}

	static function Initialize() {
		topScore = fetchTopScore();
		currentScore = 0;
		displayScore = 0;
	}

	static function fetchTopScore() {
		//TODO: Retrieve from filesystem
		return 0;
	}

	private function setTopScore(numPoints : int) {
		topScore = numPoints;
		topScoreLabel.text = ""+topScore;
		topScoreLabel.color = getScoreColor(topScore);

		//TODO: Save in filesystem
	}

	static function getScoreColor(num : float) {
		var adjustedNum = num * 2048.0 / 20480.0;
		return TileColors.getColor(adjustedNum);
	}

	private function setScore(numPoints : int) {
		currentScore = numPoints;
		if (currentScore > topScore) {
			setTopScore(currentScore);
		}
	}

	static function addPoints(numPoints : int) {
		instance.setScore(currentScore+numPoints);
	}

	function generateScoreBonus(numPoints : int) {
		var bonus = GameObject.Instantiate(scoreBonusPrefab, scoreLabel.transform.position, scoreLabel.transform.rotation);
		bonus.init(numPoints);
	}

	static function resetScore() {
		currentScore = 0;
		displayScore = 0;
	}

}