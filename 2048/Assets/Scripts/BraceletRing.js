#pragma strict

private var deathTime : float;
private var markedForDeath = false;

function Update() {
	if (markedForDeath) {
		if (Time.time - deathTime > .4) {
			print("Destroying");
			Destroy(gameObject);
		}

		var desiredSize = (Time.time - deathTime < 0.1) ? .1 : 0;
		transform.localScale.y = Mathf.Lerp(transform.localScale.y, desiredSize, 0.3);
	}
}

function setValue(value : float) {
	renderer.material.color = TileColors.getColor(value);
}

function markForDeath() {
	deathTime = Time.time;
	markedForDeath = true;
}

