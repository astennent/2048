#pragma strict
import System.Collections.Generic;

class GameController extends MonoBehaviour {
	static var boards = new List.<Board>();

	static function registerBoard(board : Board) {
		boards.Add(board);
	}

	function Update() {
		if(Input.GetKeyDown(KeyCode.UpArrow)) {
			onMove(Board.UP);
		} 
		if (Input.GetKeyDown(KeyCode.DownArrow)) {
			onMove(Board.DOWN);
		}
		if (Input.GetKeyDown(KeyCode.LeftArrow)) {
			onMove(Board.LEFT);
		}
		if (Input.GetKeyDown(KeyCode.RightArrow)) {
			onMove(Board.RIGHT);
		}
	}

	function onMove(direction : int) {
		for (var board in boards) {
			board.onMove(direction);
		}
	}



}