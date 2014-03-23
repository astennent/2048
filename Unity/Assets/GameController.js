#pragma strict
import System.Collections.Generic;

class GameController extends MonoBehaviour {

	var tilePrefab : Tile;
	static var board : Tile[,];
	var boardChanged = false;

	var UP = 0;
	var DOWN = 1;
	var LEFT = 2;
	var RIGHT = 3;

	function Start () {
		board = new Tile[4, 4];
		generateTile();
		generateTile();
	}

	function generateTile() {
		var options = new List.<Vector2>();
		for (var x = 0 ; x < board.GetLength(0) ; x++) {
			for (var y = 0 ; y < board.GetLength(1) ; y++) {
				if (board[x,y] == null) {
					options.Add(new Vector2(x, y));
				}
			}
		}
		var index = Random.Range(0, options.Count);
		var coordinate = options[index];

		var tile = GameObject.Instantiate(tilePrefab, transform.position, transform.rotation);
		tile.init(coordinate);
	}

	static function updateBoard(coordinate : Vector2, tile : Tile) {
		board[coordinate.x, coordinate.y] = tile;
	}

	function Update() {
		if(Input.GetKeyDown(KeyCode.UpArrow)) {
			onMove(UP);
		} 
		if (Input.GetKeyDown(KeyCode.DownArrow)) {
			onMove(DOWN);
		}
		if (Input.GetKeyDown(KeyCode.LeftArrow)) {
			onMove(LEFT);
		}
		if (Input.GetKeyDown(KeyCode.RightArrow)) {
			onMove(RIGHT);
		}
	}

	function onMove(direction : int) {

		var primaryAxisCount = board.GetLength(0);
		var secondaryAxisCount = board.GetLength(1);

		for (var i = 0 ; i < primaryAxisCount ; i++) {
			var tempTiles = new List.<Tile>();
			for (var j = 0 ; j < secondaryAxisCount ; j++) {

				switch(direction) {
					case UP:
						tempTiles.Add(board[i, j]);
						break;
					case DOWN:
						tempTiles.Add(board[i, secondaryAxisCount-j-1]);
						break;
					case LEFT:
						tempTiles.Add(board[secondaryAxisCount-j-1,i]);
						break;
					case RIGHT:
						tempTiles.Add(board[j,i]);
						break;
				}
			}

			
			shiftAndMergeRow(tempTiles, direction);
		}

		if (boardChanged) {
			handleBoardChange(direction);
		}
		boardChanged = false;

	}

	function shiftAndMergeRow(tiles : List.<Tile>, direction : int) {

		//Shift
		tiles = shiftRow(tiles);

		//Merge
		tiles = mergeRow(tiles);

		//Shift
		tiles = shiftRow(tiles);

		//Update tile positions
		for (var i = 0 ; i < tiles.Count ; i++) {
			if (tiles[i] != null) {
				switch(direction) {
					case UP:
						tiles[i].setY(i);
						break;
					case DOWN:
						tiles[i].setY( board.GetLength(0)-i-1);
						break;
					case LEFT:
						tiles[i].setX( board.GetLength(1)-i-1);
						break;
					case RIGHT:
						tiles[i].setX(i);
						break;
				}
			}
		}

		return tiles;

	}

	private function shiftRow(tiles : List.<Tile>) {

		//The last known index with a Tile (starting with a fake one out of range)
		var lastFilledIndex = tiles.Count;

		//Loop backwards over the Tile array
		for (var i = tiles.Count-1; i >= 0 ; i--) {

			// Shift tiles that are filled
			if (tiles[i] != null) {

				//Don't shift if you're not actually moving
				if (lastFilledIndex - 1 != i) {
					tiles[lastFilledIndex-1] = tiles[i];
					tiles[i] = null;
					boardChanged = true;
				}

				//Update the last filed index
				lastFilledIndex--;
			}
		}
		return tiles;
	}

	private function mergeRow(tiles : List.<Tile>) {

		//Loop backwards over the Tile array
		for (var i = tiles.Count-1; i >= 1 ; i--) {

			if (tiles[i] != null && tiles[i-1] != null && tiles[i].value == tiles[i-1].value) {
				tiles[i].prepareToAbsorb(tiles[i-1]);
				tiles[i-1].markForDeath();
				tiles[i-1] = null;
				boardChanged = true;
			}

		}
		return tiles;
	}

	private function handleBoardChange(direction : int) {
		generateTile();
		printBoard();
	}

	function printBoard(){
		var s = "";
		for (var i = 0 ; i < board.GetLength(0) ; i++) {
			s += " ";
			for (var j = 0 ; j < board.GetLength(1) ; j++) {
				var tile = board[i,j];
				if (tile != null) {
					s+=board[i,j].value;
					} else {
						s+="0";
					}	
			}
		}
		print(s);
	}

}