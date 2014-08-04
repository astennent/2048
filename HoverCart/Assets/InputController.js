#pragma strict

var analogBase : Texture;
var analogStick : Texture;

private static var analogSize = 80;


// Static controls
private static var leftAnalogPosition = Vector2.zero;
private static var rightAnalogPosition = Vector2.zero;

static function getLeftYAxis() : float{
	return leftAnalogPosition.y;
}

static function getLeftXAxis()  : float{
	return leftAnalogPosition.x;
}

static function getRightYAxis() : float {
	return rightAnalogPosition.y;
}

static function getRightXAxis()  : float{
	return rightAnalogPosition.x;
}

function Start () {

}

function Update () {

}

function OnGUI() {
	var screenHeight = 400;
	var screenWidth = 800;
	var horizontalPadding = 10;
	var verticalPosition = (screenHeight-analogSize)/2;
	leftAnalogPosition = DrawAnalog(new Vector2(horizontalPadding + analogSize/2, verticalPosition));
	rightAnalogPosition = DrawAnalog(new Vector2(600, verticalPosition));	
}

// Returns a value between -1 and 1
function DrawAnalog(position : Vector2) : Vector2 {
	var baseRect = new Rect(position.x-analogSize/2, position.y-analogSize/2, analogSize, analogSize);
	GUI.DrawTexture(baseRect, analogBase);


	var analogStickPosition : Vector2;
	if (Input.GetMouseButton(0)) {
		analogStickPosition = Input.mousePosition;;
		analogStickPosition.y = Screen.height - analogStickPosition.y;
	} else {
		analogStickPosition = new Vector2(baseRect.x + analogSize/2, baseRect.y + analogSize/2);
	}
	var minX = baseRect.x + analogSize*1.0/3;
	var maxX = baseRect.x + analogSize*2.0/3;
	var minY = baseRect.y + analogSize*1.0/3;
	var maxY = baseRect.y + analogSize*2.0/3;
	analogStickPosition.x = Mathf.Clamp(analogStickPosition.x, minX, maxX);
	analogStickPosition.y = Mathf.Clamp(analogStickPosition.y, minY, maxY);

	var stickRect = new Rect(analogStickPosition.x-analogSize/2, 
			analogStickPosition.y-analogSize/2, analogSize, analogSize);

	GUI.DrawTexture(stickRect, analogStick);

	// Update the stactic control value
	var leftAnalogX = 2 * (analogStickPosition.x - minX) / (maxX - minX) - 1;
	var leftAnalogY = -2 * (analogStickPosition.y - minY) / (maxY - minY) + 1;
	return new Vector2(leftAnalogX, leftAnalogY);
}