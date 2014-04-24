#pragma strict

private var rings : LinkedList.<BraceletRing> = new LinkedList.<BraceletRing>();
var ringPrefab : BraceletRing;

function spawnRings(numRings : int, values : int[]) {
	var min = Mathf.Min(values);
	var max = Mathf.Max(values);

	rings = new LinkedList.<BraceletRing>();
	var ring_spacing = 0.2;
	for (var i = 0 ; i < numRings ; i++) {
		var ring = GameObject.Instantiate(ringPrefab, transform.position, transform.rotation);
		ring.transform.position.y += i*ring_spacing;

		var value = values[i%4];
		ring.setValue(value);

		rings.AddLast(ring);
	}
}

function clearRings() {
	for (var ring in rings) {
		ring.markForDeath();
	}
	rings.Clear();
}

function removeRing() {
	if (rings.Count > 0) {
		var doomedRing = rings.Last.Value;
		rings.RemoveLast();
		doomedRing.markForDeath();
	}
}