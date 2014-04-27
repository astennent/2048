#pragma strict

class Board extends MonoBehaviour {
	
	var board : Tile[,];
	var tilePrefab : Tile;
	var island : Island;

	private var boardChanged = false;
	private var mergedPointTotal : int;

	static var NONE = -1;
	static var UP = 0;
	static var DOWN = 1;
	static var LEFT = 2;
	static var RIGHT = 3;

	private var boardWon = false;
	private var boardLost = false;

	var boardSize : int = 4;

	// Variants
	private var turnsToReset = 0;
	private var spawnTileValue : int = 2;

	var bracelet : Bracelet;

	function Start () {
		board = new Tile[boardSize, boardSize];
		island.registerBoard(this);
	}

	function resetTiles() {
		//Destroy all tiles.
		for (var x = 0 ; x < board.GetLength(0) ; x++) {
			for (var y = 0 ; y < board.GetLength(1) ; y++) {
				if (board[x,y] != null) {
					board[x,y].markForReset();
				}
			}
		}

		//Create a new board
		board = new Tile[boardSize, boardSize];
		generateTile();
		generateTile();
		turnsToReset = 0;

		if (bracelet != null) {
			bracelet.clearRings();
		}

		boardWon = false;
		boardLost = false;
	}

	function isWon() {
		return boardWon;
	}

	function isLost() {
		return boardLost;
	}

	function getMergedPointTotal() {
		return mergedPointTotal;
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

	// Returns true if tiles were moved.
	function onMove(direction : int) {

		mergedPointTotal = 0;

		for (var i = 0 ; i < boardSize ; i++) {
			var tempTiles = new List.<Tile>();
			for (var j = 0 ; j < boardSize ; j++) {

				switch(direction) {
					case UP:
						tempTiles.Add(board[i, j]);
						break;
					case DOWN:
						tempTiles.Add(board[i, boardSize-j-1]);
						break;
					case LEFT:
						tempTiles.Add(board[boardSize-j-1,i]);
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

		var output = boardChanged;
		boardChanged = false;
		return output;
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
						tiles[i].setY( boardSize-i-1);
						break;
					case LEFT:
						tiles[i].setX( boardSize-i-1);
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
				var pointValue = tiles[i].value*2;
				ScoreController.addPoints(pointValue);
				mergedPointTotal += pointValue;
				
				//Notify the tiles of the changes
				tiles[i].setValue(pointValue);
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
		if (boardLost) {
			handleBoardLost();
		}
	}

	private function checkForWin() {
		for (var i = 0 ; i < boardSize ; i++) {
			for (var j = 0 ; j < boardSize ; j++) {
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

		// The number of turns before the board resets increases with spawnTileValue
		turnsToReset = spawnTileValue+1;

		return true;
	}

	function handleBoardLost() {
		//Turn everything to metal and notes what the values are.
		var values = new int[board.GetLength(0) * board.GetLength(1)];
		var valueIndex = 0;
		for (var x = 0 ; x < board.GetLength(0) ; x++) {
			for (var y = 0 ; y < board.GetLength(1) ; y++) {
				board[x,y].markFrozen();
				values[valueIndex++] = board[x,y].value;
			}
		}
		if (island.canRessurect) {
			bracelet.spawnRings(turnsToReset, values);
		}
	}

	//Reduces the number of turns remaining before the board can ressurect by 1.
	function decrementResetCounter() {
		if (island.canRessurect && turnsToReset > 0) {
			turnsToReset-=1;
			bracelet.removeRing();
			if (turnsToReset == 0) {
				ressurect();
			}
		} 
	}

	function resetSpawnTileValue() {
		spawnTileValue = 2;
	}

	function ressurect() {
		spawnTileValue++;
		resetTiles();
	}

	function getSpawnTileValue() {
		return spawnTileValue;
	}

}