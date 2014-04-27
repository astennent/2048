using UnityEngine;
using System.Collections;

public class example : MonoBehaviour {
public float duration = 1.0F;
void Update() {
float phi = Time.time / duration * 2 * Mathf.PI;
float amplitude = Mathf.Cos(phi) * 0.5F + 0.5F;
light.intensity = amplitude;
}
}