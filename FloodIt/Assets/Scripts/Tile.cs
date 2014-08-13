using UnityEngine;
using System.Collections;

public class Tile : MonoBehaviour {

	Transform plane;
	Transform reversePlane;

	private bool facingForward = true;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		processFlip();

		if (Input.GetMouseButtonDown(0)) {
			flip();
		}
	}

	void flip() {
		facingForward = !facingForward;
	}

	void processFlip() {
		float desiredY = (facingForward) ? 0f : 180f;

		Vector3 currentRotation = transform.rotation.eulerAngles;
		Vector3 transitionRotation = Vector3.Lerp(currentRotation, new Vector3(0, desiredY, 0), 0.25f);

		transform.rotation = Quaternion.Euler(transitionRotation);
	}
}
