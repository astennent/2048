﻿#pragma strict
import System.Collections.Generic;

class GameController extends MonoBehaviour {
	static var activeIsland : Island;

	var classicIsland : Island;
	var foursIsland : Island;
	var gameCamera : GameCamera;

	function Start() {
		setIsland(null);
	}

	function Update() {
		var direction = InputController.getInputDirection();
		gameCamera.nudge(direction);
		onMove(direction);
	}

	function playClassic() {
		setIsland(classicIsland);
	}

	function playFours() {
		setIsland(foursIsland);
	}

	static function setIsland(island : Island) {
		activeIsland = island;

		if (activeIsland != null && activeIsland.isGameOver()) {
			activeIsland.restartIsland();
		}
 
	}

	static function onMove(direction : int) {
		if (activeIsland != null) { 
			activeIsland.onMove(direction);
		}
	}

	static function Exit() {

	}

	static function DisplayMedals() {

	}



}