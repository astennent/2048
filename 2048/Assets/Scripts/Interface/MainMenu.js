class MainMenu extends MonoBehaviour {

	private var gameController : GameController;
	private var gameCamera : GameCamera;

	static var originalWidth : float = 480;
	static var originalHeight : float = 800;

	var showingAchievements = false;

	var menuFont : Font;

	function Start() {
		gameController = GetComponent(GameController);
		gameCamera = GameObject.FindGameObjectWithTag("MainCamera").GetComponent(GameCamera);
	}

	static function getGUIScale() {
		var scale = new Vector3(Screen.width/originalWidth, Screen.height/originalHeight, 1);
		return Matrix4x4.TRS(Vector3.zero, Quaternion.identity, scale);
	}
	
	function OnGUI() {

		GUI.skin.font = menuFont;

		if (GameController.activeIsland != null) {
			return;
		} 
		
		var width = 400;
		var height = 100;
		var verticalPadding = 20 + height;
		var y = 200;
		var x = 40;

		var buttonRect = new Rect(x, y, width, height);

		var svMat = GUI.matrix; // save current matrix
		GUI.matrix = getGUIScale();

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
			buttonRect.y = 620;
			if (GUI.Button(buttonRect, "Back")) {
				toggleAchievements();
			}						
		}

		GUI.matrix = svMat;
		
	}

	function toggleAchievements() {
		showingAchievements = !showingAchievements;
		gameCamera.invalidate();
	}

}