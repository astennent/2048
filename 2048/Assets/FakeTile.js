#pragma strict

class FakeTile extends BaseTile {

	private var letter : char; //letter in the word
	private var letterIndex : int; //index in the word
	private var button : AnimatedButton;

	private var dispersing = false;

	function Update() {
		super.Update();
		if (value - display_value > .1) {
			//display_value += value/90.0;
			display_value*=1.04;
		} else {
			label.text = ""+letter;
		}
		if (dispersing) {

		} else {
			transform.localScale = Vector3.Lerp(transform.localScale, Vector3.one, 0.1);
			transform.localPosition = Vector3.Lerp(transform.localPosition, desiredPosition, 0.1);
			transform.rotation = Quaternion.Lerp(transform.rotation, button.transform.rotation, 0.1);			
		}

	}

	function init(letter : char, letterIndex : int, button : AnimatedButton) {
		this.letter = letter;
		this.letterIndex = letterIndex;
		this.button = button;
		transform.parent = button.transform;
		value = 2048;
		display_value = Random.Range(0, 256);

		desiredPosition = Vector3.zero;
		desiredPosition.x += letterIndex;	

		transform.localPosition = getScrambledPosition();
		transform.rotation = getScrambledRotation();
	}

	function getScrambledPosition() {
		var output = Vector3.zero;
		for (var i = 0 ; i < 3 ; i++) {
			output[i] = Random.Range(-5.0, 5.0);
		}
		return output;
	}

	function getScrambledRotation() {
		var output = transform.rotation;
		for (var i = 0 ; i < 4 ; i++) {
			output[i] = Random.Range(0.0, 1.0);
		}
		return output;
	}

	function disperse() {

	}

}