var animatedButtonPrefab : AnimatedButton;

class MainMenu extends MonoBehaviour {
	
	protected var buttonNames : List.<String>;
	protected var buttonFunctions : List.<Function>;
	protected var buttons : List.<AnimatedButton>;

	function Start() {
		buttonNames = new List.<String>();
		buttonNames.Add("Play");
		buttonNames.Add("Medals");
		buttonNames.Add("Exit");

		buttonFunctions.Add(GameController.Play);
		buttonFunctions.Add(GameController.DisplayMedals);
		buttonFunctions.Add(GameController.Exit);
	}

	function Show() {
		buttons = new List.<AnimatedButton>();
		for (var i = 0 ; i < buttonNames.Count ; i++) {
			var extraSpace : float = 40;
			var x = Screen.width/2.0;
			var y = (Screen.height-extraSpace) / buttonNames.Count * i + extraSpace;
			var z = 5;
			var location : Vector3 = Camera.main.ScreenToWorldPoint(new Vector3(x, y, z));
			var button = GameObject.Instantiate(animatedButtonPrefab, location, transform.rotation);
			button.init(buttonNames[i], buttonFunctions[i]);
			buttons.Add(button);
		}
	}

	function Hide() {
		for (var button in buttons) {
			button.disperse();
		}
		buttons.Clear();
	}


}