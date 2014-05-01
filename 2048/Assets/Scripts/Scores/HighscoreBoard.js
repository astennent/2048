#pragma strict

private var gameCamera : GameCamera;
private static var valid = false;

var classicText : TextMesh;
var foursText : TextMesh;
var timedText : TextMesh;

function Start () {
	gameCamera = GameObject.FindGameObjectWithTag("MainCamera").GetComponent(GameCamera);
}

function Update () {
	var render = (gameCamera.transform.position.y < -4);
	renderer.enabled = render;
	for (var child : Transform in transform) {
		child.renderer.enabled = render;
	}

	if (render && !valid) {
		refreshTopScores();
	}
}

function refreshTopScores() {
	var classicScore = PlayerPrefs.GetInt("Classic");
	var foursScore = PlayerPrefs.GetInt("Fours");
	var timedScore = PlayerPrefs.GetInt("Timed");

	classicText.text = classicScore + "";
	classicText.color = ScoreController.getScoreColor(classicScore);

	foursText.text = foursScore + "";
	foursText.color = ScoreController.getScoreColor(foursScore);

	timedText.text = timedScore + "";
	timedText.color = ScoreController.getScoreColor(timedScore);

	valid = true;
}

static function invalidate() {
	valid = false;
}