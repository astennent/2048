#pragma strict

class Tile extends BaseTile {

	private var currentPosition : Vector2;

	private var absorbingTile : Tile = null;
	private var markedForDeath = false;
	private var deathTime : float;
	private var expandTime : float = -1;

	private var board : Board;

	function init(coordinate : Vector2, board : Board) {
		this.board = board;
		transform.parent = board.transform.parent;
		transform.localScale = Vector3.zero;

		// Choose a random value (2 or 4)
		var rand = Random.Range(0.0, 1.0);
		if (rand < 0.9) {
			setValue(2);
		} else {
			setValue(4);
		}

		//Randomly adjust the texture
		var offset = new Vector2(Random.Range(0,1.0),Random.Range(0, 0.8));
		renderer.material.SetTextureOffset ("_MainTex", offset);

		// Set the coordinate and immediately jump to it.
		setPosition(coordinate);
		transform.localPosition = desiredPosition;
	}

	function Update() {
		super.Update();
		if (markedForDeath) {
			UpdateDying();
		} else {
			UpdateLiving();
		}
	}

	private function UpdateDying() {
		transform.localPosition = Vector3.Lerp(transform.localPosition, absorbingTile.transform.localPosition, 0.2);
		if (Vector3.Distance(transform.localPosition, absorbingTile.transform.localPosition) < .5) {
			transform.localScale = Vector3.Lerp(transform.localScale, Vector3.zero, 0.1);
		}

		display_value -= value/32.0;

		if (Time.time - deathTime > .7) {
			explode();
		} 
	}

	private function UpdateLiving() {
		transform.localPosition = Vector3.Lerp(transform.localPosition, desiredPosition, 0.1);
		
		if (Time.time - expandTime < .25) {
			var desiredScale = 1.2;
			var scalingSpeed = .3;
		} else {
			desiredScale = 1.0;
			scalingSpeed = .1;
		}
		transform.localScale = Vector3.Lerp(transform.localScale, desiredScale*Vector3.one, scalingSpeed);

		if (display_value < value - .1) {
			display_value += value/32.0;
		} else {
			display_value = value;
		}
	}

	function markForDeath(absorbingTile : Tile) {
		markedForDeath = true;
		this.absorbingTile = absorbingTile;
		board.updateBoard(currentPosition, null);
		deathTime = Time.time;
	}

	function markForExpansion() {
		expandTime = Time.time;
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
		currentPosition = coordinate;
		desiredPosition = transformPosition(coordinate.x, coordinate.y);
	}

	private function transformPosition(x : int, y : int) {
		var x_coordinate = 1.2*x - 1.8;
		var y_coordinate = 1.2*y - 1.8;
		return new Vector3(x_coordinate, y_coordinate, 0);
	}

	//Do two tiles match? Abstracted for different game types.
	function isMatch(tile1 : Tile, tile2 : Tile) {
		return (tile1 != null) ? tile1.matches(tile2) : false;
	}
	function matches(other : Tile) {
		return (other != null) ? (value == other.value) : false;
	}

}