#pragma strict

static var colors = [
	new Color(.63, .69, .37),
	new Color(.57, .61, .32),	//2
	new Color(.32, .68, .85),	//4
	new Color(.75, .81, .27),	//8
	new Color(.41, .73, .36),	//16
	new Color(.73, .31, .36),	//32
	new Color(.65, .39, .62),	//64
	new Color(.37, .39, .63),	//128
	new Color(.53, .74, .81),	//256
	new Color(.31, .47, .90),	//512
	new Color(.61, .62, .90), 	//1024
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