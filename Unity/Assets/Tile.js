﻿#pragma strict

class Tile extends MonoBehaviour {

	private var desiredPosition : Vector3;	
	var currentPosition : Vector2;
	var value : int;
	var label : TextMesh;


	var spawnTime : float;

	private var tileToAbsorb : Tile = null;
	private var markedForDeath = false;

	function init(coordinate : Vector2) {
		
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


		spawnTime = Time.time;
	}

	function Update() {
		if (markedForDeath) {
			transform.localScale = Vector3.Lerp(transform.localScale, Vector3.zero, 0.05);
		} else {
			transform.localScale = Vector3.Lerp(transform.localScale, Vector3.one, 0.05);
		}

		transform.position = Vector3.Lerp(transform.position, desiredPosition, 0.1);
		if (tileToAbsorb != null && Vector3.Distance(transform.position, desiredPosition) < 0.2) {
			absorbTarget();
		}
 
	}

	private function setValue(value : int) {
		this.value = value;
		label.text = ""+value;
	}


	function prepareToAbsorb(doomedTile : Tile) {
		tileToAbsorb = doomedTile;
	}

	private function absorbTarget() {
		setValue(value * 2);
		tileToAbsorb.getAbsorbed();
		tileToAbsorb = null;
	}

	function markForDeath() {
		markedForDeath = true;
		GameController.updateBoard(currentPosition, null);
	}

	function getAbsorbed() {
		Destroy(gameObject);
	}

	function setX(x : int) {
		setPosition(new Vector2(x, currentPosition.y));
	}
	function setY(y : int) {
		setPosition(new Vector2(currentPosition.x, y));
	}

	function setPosition(coordinate : Vector2) {
		if (GameController.board[currentPosition.x, currentPosition.y] == this) {
			GameController.updateBoard(currentPosition, null);
		}
		GameController.updateBoard(coordinate, this);
		desiredPosition = transformPosition(coordinate.x, coordinate.y);
		currentPosition = coordinate;
	}

	private function transformPosition(x : int, y : int) {
		var x_coordinate = 1.2*x - 1.8;
		var y_coordinate = 1.2*y - 1.8;
		return new Vector3(x_coordinate, y_coordinate, 0);
	}




}