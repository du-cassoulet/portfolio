import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { backgroundFragmentShader, backgroundVertexShader } from "./shader.js";

{
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
		vertexShader: backgroundVertexShader,
		fragmentShader: backgroundFragmentShader,
	});

	const mesh = new THREE.Points(geometry, material);
	scene.add(mesh);

	mesh.rotation.x = -Math.PI * 0.25;

	const container = document.body;
	renderer.domElement.classList.add("background");
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
}

{
	const scene = new THREE.Scene();

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(500, 500);
	renderer.setClearColor(0x000000, 0);

	const camera = new THREE.PerspectiveCamera(60, 1, 1, 100);

	camera.position.set(0, 2.5, 2.5);
	camera.updateProjectionMatrix();

	const controls = new OrbitControls(camera, renderer.domElement);

	const loader = new GLTFLoader();
	const gltf = await loader.loadAsync("./3d/bird/scene.gltf");
	const mixer = new THREE.AnimationMixer(gltf.scene);
	mixer.clipAction(gltf.animations[0]).play();
	scene.add(gltf.scene);

	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 50, 0);
	light.lookAt(0, 0, 0);
	scene.add(light);

	const container = document.body;
	renderer.domElement.classList.add("bird");
	container.appendChild(renderer.domElement);

	controls.update();
	renderer.render(scene, camera);

	const clock = new THREE.Clock();
	function animate() {
		requestAnimationFrame(animate);

		controls.update();
		mixer.update(clock.getDelta());
		renderer.render(scene, camera);
	}

	animate();
}
