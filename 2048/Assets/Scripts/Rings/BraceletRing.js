#pragma strict

private var deathTime : float;
private var markedForDeath = false;
private var desiredPosition : Vector3;

function Update() {
	if (markedForDeath) {
		if (Time.time - deathTime > .4) {
			Destroy(gameObject);
		}

		var desiredSize = (Time.time - deathTime < 0.1) ? .1 : 0;
		transform.localScale.y = Mathf.Lerp(transform.localScale.y, desiredSize, 0.3);
	} 
	transform.position = Vector3.Lerp(transform.position, desiredPosition, 0.2);
}

function setDesiredPosition(desiredPosition : Vector3) {
	this.desiredPosition = desiredPosition;
}

function setValue(value : float) {
	renderer.material.color = TileColors.getColor(value);
}

function markForDeath() {
	deathTime = Time.time;
	markedForDeath = true;
}

