#pragma strict

class BaseTile extends MonoBehaviour {

	protected var desiredPosition : Vector3;	

	var value : int;
	var display_value : float;
	var label : TextMesh;

	function setValue(value : int) {
		this.value = value;
	}

	function Update() {
		if (display_value > 0) {
			label.text = ""+parseInt(display_value);
		} else {
			label.text = "";
		}
		renderer.material.color = TileColors.getColor(display_value);
	}

}