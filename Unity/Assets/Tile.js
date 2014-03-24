#pragma strict

class Tile extends MonoBehaviour {

	private var desiredPosition : Vector3;	
	var currentPosition : Vector2;
	var value : int;
	var display_value : float;
	var label : TextMesh;

	private var absorbingTile : Tile = null;
	private var markedForDeath = false;
	private var deathTime : float;

	private var board : Board;


	function init(coordinate : Vector2, board : Board) {

		this.board = board;
		transform.parent = board.transform.parent;

		// Choose a random value (2 or 4)
		var rand = Random.Range(0.0, 1.0);
		if (rand < 0.9) {
			setValue(2);
		} else {
			setValue(4);
		}

		// Set the coordinate and immediately jump to it.
		setPosition(coordinate);
		transform.position = desiredPosition;
	}

	function Update() {
		if (markedForDeath) {
			UpdateDying();
		} else {
			UpdateLiving();
		}
		label.text = ""+parseInt(display_value);
		renderer.material.color = TileColors.getColor(display_value);
	}

	function UpdateDying() {
		transform.localScale = Vector3.Lerp(transform.localScale, Vector3.zero, 0.05);
		transform.localPosition = Vector3.Lerp(transform.localPosition, absorbingTile.transform.position, 0.02);

		if (display_value > 0) {
			display_value -= value/32.0;
		} else if (Time.time - deathTime > .7) {
			explode();
		} 
	}

	function UpdateLiving() {
		transform.localScale = Vector3.Lerp(transform.localScale, Vector3.one, 0.1);
		transform.localPosition = Vector3.Lerp(transform.localPosition, desiredPosition, 0.1);

		if (display_value < value - .1) {
			display_value += value/32.0;
		} else {
			display_value = value;
		}
	}

	function setValue(value : int) {
		this.value = value;
	}

	function markForDeath(absorbingTile : Tile) {
		markedForDeath = true;
		this.absorbingTile = absorbingTile;
		board.updateBoard(currentPosition, null);
		deathTime = Time.time;
	}

	function explode() {
		Destroy(gameObject);
	}

	function setX(x : int) {
		setPosition(new Vector2(x, currentPosition.y));
	}
	function setY(y : int) {
		setPosition(new Vector2(currentPosition.x, y));
	}

	function setPosition(coordinate : Vector2) {
		if (board.board[currentPosition.x, currentPosition.y] == this) {
			board.updateBoard(currentPosition, null);
		}
		board.updateBoard(coordinate, this);
		desiredPosition = transformPosition(coordinate.x, coordinate.y);
		currentPosition = coordinate;
	}

	private function transformPosition(x : int, y : int) {
		var x_coordinate = 1.2*x - 1.8;
		var y_coordinate = 1.2*y - 1.8;
		return new Vector3(x_coordinate, y_coordinate, 0);
	}




}