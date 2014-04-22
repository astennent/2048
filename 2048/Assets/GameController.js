#pragma strict
import System.Collections.Generic;

class GameController extends MonoBehaviour {
	static var boards = new List.<Board>();
	static var activeIsland : Island;

	var classicIsland : Island;
	var foursIsland : Island;
	var gameCamera : GameCamera;

	static function registerBoard(board : Board) {
		boards.Add(board);
	}

	function Start() {
		ScoreController.Initialize();
	}

	function Update() {
		var direction = InputController.getInputDirection();
		gameCamera.nudge(direction);

		for (var board in boards) {
			if (activeIsland == board.island) {
				board.onMove(direction);
			}
		}
	}

	function playClassic() {
		activeIsland = classicIsland;
	}

	function playFours() {
		activeIsland = foursIsland;
	}

	function onMove(direction : int) {

	}

	static function Exit() {

	}

	static function DisplayMedals() {

	}



}