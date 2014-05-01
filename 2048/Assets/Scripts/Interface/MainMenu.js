class MainMenu extends MonoBehaviour {

	private var gameController : GameController;
	private var gameCamera : GameCamera;
	var showingAchievements = false;

	function Start() {
		gameController = GetComponent(GameController);
		gameCamera = GameObject.FindGameObjectWithTag("MainCamera").GetComponent(GameCamera);
	}
	
	function OnGUI() {
		if (GameController.activeIsland != null) {
			return;
		} 
		
		var width = Screen.width*3.0/4.0;
		var height = Screen.height*1.0/8.0;
		var verticalPadding = Screen.height*1.2/8.0;
		var y = Screen.height*1.0/3.0;
		var x = Screen.width*1.0/8.0;

		var buttonRect = new Rect(x, y, width, height);

		if (!showingAchievements) {

			if (GUI.Button(buttonRect, "Classic")) {
				gameController.playClassic();
			}

			buttonRect.y += verticalPadding;
			if (GUI.Button(buttonRect, "Fours")) {
				gameController.playFours();
			}

			buttonRect.y += verticalPadding;
			if (GUI.Button(buttonRect, "Timed")) {
				gameController.playTimed();
			}

			buttonRect.y += verticalPadding;
			if (GUI.Button(buttonRect, "Achievements")) {
				toggleAchievements();
			}
		} else {
			buttonRect.y = Screen.height - verticalPadding/2 - height;
			if (GUI.Button(buttonRect, "Back")) {
				toggleAchievements();
			}						
		}
		
	}

	function toggleAchievements() {
		showingAchievements = !showingAchievements;
		gameCamera.invalidate();
	}

}