#pragma strict
import System.Collections.Generic;

class GameController extends MonoBehaviour {
	static var boards = new List.<Board>();

	static function registerBoard(board : Board) {
		boards.Add(board);
	}

	function Start() {
		ScoreController.Initialize();
	}

	function Update() {
		var direction = InputController.getInputDirection();
		for (var board in boards) {
			board.onMove(direction);
		}
	}

	function onMove(direction : int) {

	}

	static function Play() {

	}

	static function Exit() {

	}

	static function DisplayMedals() {

	}



}