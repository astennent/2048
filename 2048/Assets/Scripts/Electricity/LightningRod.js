#pragma strict

var arcPrefab : ElectricArc;

function generateSpark(target : Transform, sparkDuration : float) {
	generateSpark(transform, target, sparkDuration);
}

function generateSpark(from : Transform, to : Transform, sparkDuration : float) {
	var arc = GameObject.Instantiate(arcPrefab, transform.position, transform.rotation);
	arc.initialize(from, to, sparkDuration);
}