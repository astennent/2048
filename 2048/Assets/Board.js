#pragma strict

class Board extends MonoBehaviour {
	
	var board : Tile[,];
	var tilePrefab : Tile;
	var boardHolder : BoardHolder;

	private var boardChanged = false;

	static var NONE = -1;
	static var UP = 0;
	static var DOWN = 1;
	static var LEFT = 2;
	static var RIGHT = 3;

	private var boardWon = false;
	private var boardLost = false;

	function Start () {
		board = new Tile[4, 4];
		generateTile();
		generateTile();
		GameController.registerBoard(this);
	}

	function isWon() {
		return boardWon;
	}

	function isLost() {
		return boardLost;
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
		tile.init(coordinate, this);
	}

	function updateBoard(coordinate : Vector2, tile : Tile) {
		board[coordinate.x, coordinate.y] = tile;
	}

	function onMove(direction : int) {

		boardHolder.nudge(direction);

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
					default: break;
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
					default: break;
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

			if (tiles[i] != null && tiles[i-1] != null && tiles[i].matches(tiles[i-1])) {
				
				//Record the change in score
				ScoreController.addPoints(tiles[i].value*2);
				
				//Notify the tiles of the changes
				tiles[i].setValue(tiles[i].value*2);
				tiles[i].markForExpansion();
				tiles[i-1].markForDeath(tiles[i]);
				
				//Update stored board
				tiles[i-1] = null;
				boardChanged = true;
			}

		}
		return tiles;
	}

	// Called only after there has been a change (shift or merge)
	private function handleBoardChange(direction : int) {
		generateTile();
		UpdateBoardStatus();
	}

	function UpdateBoardStatus() {
		boardWon = checkForWin();
		boardLost = checkForLoss();
	}

	private function checkForWin() {
		for (var i = 0 ; i < board.GetLength(0) ; i++) {
			for (var j = 0 ; j < board.GetLength(1) ; j++) {
				if (board[i,j] != null && board[i,j].value == 2048) {
					return true;
				}
			}
		}
		return false;
	}

	private function checkForLoss() {

		//Check for a null
		for (var i = 0 ; i < board.GetLength(0) ; i++) {
			for (var j = 0 ; j < board.GetLength(1) ; j++) {
				if (board[i,j] == null) {
					return false;
				}
			}
		}

		//Board is full, check for a move
		for (i = 0 ; i < board.GetLength(0) ; i++) {
			for (j = 0 ; j < board.GetLength(1)-1 ; j++) {
				if (board[i,j].matches(board[i,j+1])) {
					return false;
				}
				if (board[j,i].matches(board[j+1, i])) {
					return false;
				}
			}
		}
		print("Game Over");
		return true;
	}
	
}