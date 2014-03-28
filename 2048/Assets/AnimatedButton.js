#pragma strict

class AnimatedButton extends MonoBehaviour {
	var fakeTilePrefab : FakeTile;

	private var text : String;
	private var func : Function;
	private var tiles : List.<FakeTile>;

	function init(text : String, func : Function) {
		this.text = text;
		this.func = func;
	}

	function Start() {
		var tiles = new List.<FakeTile>();
		for (var i = 0 ; i < text.length ; i++) {
			var tile = GameObject.Instantiate(fakeTilePrefab, transform.position, transform.rotation);
			tile.init(text[i], i, this);
		}
	}

	function disperse() {
		for (var tile in tiles) {
			tile.disperse();
		}
	}

}