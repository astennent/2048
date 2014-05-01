#pragma strict

var gameCamera : GameCamera;
private var origFogDensity : float;
private var origFogColor : Color;

var fogDensity : float;
var fogColor : Color;

function Start() {
	origFogDensity = RenderSettings.fogDensity;
	origFogColor = RenderSettings.fogColor;
}

function Update() {
	if (gameCamera.transform.position.y < -4) {
		addFog();
	} else {
		removeFog();
	}
}

function removeFog() {
	RenderSettings.fogDensity = origFogDensity;
	RenderSettings.fogColor = origFogColor;
	RenderSettings.fog = false;
}	

function addFog() {
	RenderSettings.fogDensity = fogDensity;
	RenderSettings.fogColor = fogColor;
	RenderSettings.fog = true;
}