#pragma strict

static var deltaPosition = Vector2.zero;
static var inputFrozen = false;
static var lastInputTime = 0.0;

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


	if (Input.touchCount > 0 && Time.time - lastInputTime > 0.5)  {

		var touch = Input.GetTouch(0);

		deltaPosition += touch.deltaPosition;
 		if (deltaPosition.sqrMagnitude > 120) {
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
		

	} else {
		unfreezeInput();
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