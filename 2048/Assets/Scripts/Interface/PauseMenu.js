#pragma strict
class PauseMenu extends MonoBehaviour {

	private var gameController : GameController;
	private var lastUnpauseTime : float;

	function Start() {
		gameController = GetComponent(GameController);
	}

	function OnGUI() {
		//Just draw the pause button
		var activeIsland = gameController.activeIsland;
		if (activeIsland == null) {
			return;
		}
		
		DrawPauseButton();
		if (activeIsland.isPaused()) {
			DrawMenu();
		} else {
			lastUnpauseTime = Time.time;
		}

	}

	function DrawPauseButton() {
		var width = Screen.width/10.0;
		var padding = Screen.width/15.0;
		var pauseRect = new Rect(Screen.width-width-padding, padding, width, width);
		if (GUI.Button(pauseRect, "P")) {
			gameController.activeIsland.togglePause();
		}
	}

	function DrawMenu() {

		var transparency = Mathf.Min(0.5, Time.time - lastUnpauseTime); //fade in
		GUI.color = new Color(1, 1, 1, transparency);
		GUI.Box(new Rect(0, 0, Screen.width, Screen.height), "");
		GUI.color = Color.white;

		var buttonWidth = Screen.width * 0.8;
		var buttonHeight = buttonWidth * 0.3;
		var buttonPadding = buttonHeight * 0.2;
		var buttonY = (Screen.height - 3*buttonHeight - 2*buttonPadding)/2;

		var buttonRect = new Rect( (Screen.width - buttonWidth)/2, buttonY, buttonWidth, buttonHeight);

		if (GUI.Button(buttonRect, "Resume")) {
			print("Resuming");
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