#pragma strict
class PauseMenu extends MonoBehaviour {

	private var gameController : GameController;
	private var lastUnpauseTime : float;

	var menuFont : Font;

	function Start() {
		gameController = GetComponent(GameController);
	}

	function OnGUI() {
		GUI.skin.font = menuFont;

		var svMat = GUI.matrix; // save current matrix
		GUI.matrix = MainMenu.getGUIScale();

		//Just draw the pause button
		var activeIsland = gameController.activeIsland;
		if (activeIsland == null) {
			return;
		}
		
		if (activeIsland.isPaused()) {
			DrawMenu();
		} else {
			DrawPauseButton();
			lastUnpauseTime = Time.time;
		}

		GUI.matrix = svMat;

	}

	function DrawPauseButton() {
		var pauseRect = new Rect(140, 620, 200, 80);
		if (GUI.Button(pauseRect, "Pause")) {
			gameController.activeIsland.togglePause();
		}
	}

	function DrawMenu() {

		var transparency = (gameController.activeIsland.isGameOver()) 
				? 1.0 
				: Mathf.Min(1.0, Time.time - lastUnpauseTime); //fade in
		GUI.color = new Color(1, 1, 1, transparency);
		GUI.Box(new Rect(0, 0, 480, 800), "");

		GUI.color = Color.white;

		var buttonWidth = 400;
		var buttonHeight = 100;
		var buttonPadding = 20;
		var buttonY = 200;

		var buttonRect = new Rect(40, buttonY, buttonWidth, buttonHeight);

		if (!gameController.activeIsland.isGameOver() && GUI.Button(buttonRect, "Resume")) {
			gameController.activeIsland.unpause();
		}

		buttonRect.y += buttonHeight + buttonPadding;

		if (GUI.Button(buttonRect, "Restart")) {
			gameController.activeIsland.unpause();
			gameController.activeIsland.restartIsland();
		}

		buttonRect.y += buttonHeight + buttonPadding;

		if (GUI.Button(buttonRect, "Main")) {
			gameController.setIsland(null);
		}
	}

}