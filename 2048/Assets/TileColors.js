#pragma strict

static var colors = [
	new Color(.8, .8, 1),
	new Color(.5, .8, 1),	//2
	new Color(.2, .4, .9),	//4
	new Color(.3, .7, .6),	//8
	new Color(.7, 1, .4),	//16
	new Color(1, 1, 0),	//32
	new Color(1, .7, .3),	//64
	new Color(.8, .3, .2),	//128
	new Color(.7, .2, .8),	//256
	new Color(.4, .3, .7),	//512
	new Color(.2, .2, .2), 	//1024
	new Color(1, 1, 1) 	//2048
];

static function getColor(value : float) {
	if (value < 0) value = 0;
	
	var index = Mathf.Log(value, 2);
	index = Mathf.Clamp(index, 0, colors.length-1);
	var transitionProgress = index - parseInt(index);

	return getTransitionColor(index, transitionProgress);

}

static function getTransitionColor(index : int, transitionProgress : float) {
	var firstColor = colors[index];
	if (index == colors.length - 1) {
		return firstColor;
	}
	var secondColor = colors[index+1];

	var r = Mathf.Lerp(firstColor.r, secondColor.r, transitionProgress);
	var g = Mathf.Lerp(firstColor.g, secondColor.g, transitionProgress);
	var b = Mathf.Lerp(firstColor.b, secondColor.b, transitionProgress);

	return new Color(r, g, b);
}