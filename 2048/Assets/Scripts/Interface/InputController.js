﻿#pragma strict

static var deltaPosition = Vector2.zero;
static var inputFrozen = false;
static var sensitivity = 10;

static function getInputDirection() {
	if(Input.GetKeyDown(KeyCode.UpArrow)) {
		return (Board.UP);
	} 
	if (Input.GetKeyDown(KeyCode.DownArrow)) {
		return (Board.DOWN);
	}
	if (Input.GetKeyDown(KeyCode.LeftArrow)) {
		return (Board.LEFT);
	}
	if (Input.GetKeyDown(KeyCode.RightArrow)) {
		return (Board.RIGHT);
	}

	if (Input.touchCount == 0) {
		unfreezeInput();
	}

	if (Input.touchCount > 0 && !inputFrozen)  {

		var touch = Input.GetTouch(0);

		deltaPosition += touch.deltaPosition;
 		if (deltaPosition.x > sensitivity || deltaPosition.x < -sensitivity || deltaPosition.y > sensitivity || deltaPosition.y < -sensitivity) {
 			return extractDirection();
 		}
		
	} 

	return Board.NONE;
}

static function freezeInput() {
	inputFrozen = true;
}

static function unfreezeInput() {
	inputFrozen = false;
	deltaPosition = Vector2.zero;

}

static function extractDirection() {
	if (Mathf.Pow(deltaPosition.x, 2) > Mathf.Pow(deltaPosition.y, 2)) {
		var direction: int;
		if (deltaPosition.x > 0) {
			direction = Board.RIGHT;
		} else {
			direction = Board.LEFT;
		}
	} else {
		if (deltaPosition.y > 0) {
			direction = Board.UP;
		} else {
			direction = Board.DOWN;
		}
	}
	freezeInput();
	deltaPosition = Vector2.zero;
	return direction;
}