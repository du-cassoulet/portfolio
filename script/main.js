import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shader.js";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	1,
	100
);

camera.position.set(0, 0, 2.2);
camera.updateProjectionMatrix();

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

scene.background = new THREE.Color(0x0d1214);

const uniforms = {
	u_time: { value: 0.0 },
	u_mouse: {
		value: {
			x: 0.0,
			y: 0.0,
		},
	},
	u_resolution: {
		value: {
			x: window.innerWidth * window.devicePixelRatio,
			y: window.innerHeight * window.devicePixelRatio,
		},
	},
	u_pointsize: { value: 1.5 },
	u_noise_freq_1: { value: 4.0 },
	u_noise_amp_1: { value: 0.2 },
	u_spd_modifier_1: { value: 0.5 },
	u_noise_freq_2: { value: 3.0 },
	u_noise_amp_2: { value: 0.3 },
	u_spd_modifier_2: { value: 0.3 },
};

const geometry = new THREE.PlaneGeometry(16, 16, 512, 512);
const material = new THREE.ShaderMaterial({
	uniforms: uniforms,
	vertexShader: vertexShader,
	fragmentShader: fragmentShader,
});

const mesh = new THREE.Points(geometry, material);
scene.add(mesh);

mesh.rotation.x = -Math.PI * 0.25;

const container = document.body;
container.appendChild(renderer.domElement);

renderer.render(scene, camera);
const clock = new THREE.Clock();

function animate() {
	requestAnimationFrame(animate);

	const elapsed = clock.getElapsedTime();
	uniforms.u_time.value = elapsed;
	mesh.rotation.z += 0.0005;

	renderer.render(scene, camera);
}

animate();
