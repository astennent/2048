#pragma strict

class ScoreBoard extends MonoBehaviour {

	private var currentScore = 0;
	private var displayScore = 0;
	private var topScore = 0;
	var island : Island;
	var scoreBonusPrefab : ScoreBonus;
	var scoreLabel : TextMesh;
	var topScoreLabel : TextMesh;

	function Start() {
		island.setScoreBoard(this);
	}

	function Update() {

		//Disable all 3d labels associated with the board if it's not the active island.
		for (var child : Transform  in transform) {
			child.renderer.enabled = (GameController.activeIsland == island);
		}

		if (displayScore < currentScore-20) {
			displayScore = Mathf.Lerp(displayScore, currentScore, 0.1);
		} else if (displayScore < currentScore) {
			displayScore++;
		} else {
			displayScore = currentScore;
		}
		scoreLabel.text = ""+displayScore;

		var progressColor = ScoreController.getScoreColor(displayScore);
		scoreLabel.color = progressColor;
		RenderSettings.skybox.SetColor("_TintColor", progressColor);

	}

	function Initialize() {
		topScore = fetchTopScore();
		currentScore = 0;
		displayScore = 0;
	}

	function getCurrentScore() {
		return currentScore;
	}

	function fetchTopScore() {
		//TODO: Retrieve from filesystem
		return 0;
	}

	function setTopScore(numPoints : int) {
		topScore = numPoints;
		topScoreLabel.text = ""+topScore;
		topScoreLabel.color = ScoreController.getScoreColor(topScore);

		//TODO: Save in filesystem
	}

	function setScore(numPoints : int) {
		currentScore = numPoints;
		if (currentScore > topScore) {
			setTopScore(currentScore);
		}
	}

	function addPoints(numPoints : int) {
		setScore(currentScore+numPoints);
	}

	function generateScoreBonus(numPoints : int) {
		var bonus = GameObject.Instantiate(scoreBonusPrefab, scoreLabel.transform.position, scoreLabel.transform.rotation);
		bonus.init(numPoints);
	}

	function resetScore() {
		currentScore = 0;
		displayScore = 0;
	}

}