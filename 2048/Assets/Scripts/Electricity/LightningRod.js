#pragma strict

var arcPrefab : ElectricArc;
private var sparkDuration = .3;

function generateSpark(target : Transform) {
	generateSpark(transform, target);
}

function generateSpark(from : Transform, to : Transform) {
	var arc = GameObject.Instantiate(arcPrefab, transform.position, transform.rotation);
	arc.initialize(from, to, sparkDuration);
}