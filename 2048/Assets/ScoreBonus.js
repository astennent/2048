#pragma strict

class ScoreBonus extends MonoBehaviour {

	static var verticalSpeed = 0.02;
	var numPoints : int;
	var startTime : float;

	function init(numPoints : int) {
		startTime = Time.time;
		this.numPoints = numPoints;

		var numSpaces = (ScoreController.getCurrentScore()+"").length;
		transform.localPosition.x += .23 * numSpaces;
		GetComponent(TextMesh).text = "+"+numPoints;
		GetComponent(TextMesh).color = TileColors.getColor(numPoints);
	}	

	function Update () {
		//transform.localScale = Vector3.Lerp(transform.localScale, Vector3.zero, 0.01);
		GetComponent(TextMesh).color.a = Mathf.Lerp(GetComponent(TextMesh).color.a, 0, .1);
		transform.localPosition.y += verticalSpeed;
		if (Time.time - startTime > 1) {
			Destroy(gameObject);
		}
	}

}