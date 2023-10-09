import * as THREE from "three";
import gsap from "gsap";
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

	camera.position.set(0, 1, 2);
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
		u_pointsize: { value: 1.2 },
		u_noise_freq_1: { value: 4.0 },
		u_noise_amp_1: { value: 0.4 },
		u_spd_modifier_1: { value: 0.4 },
		u_noise_freq_2: { value: 3.0 },
		u_noise_amp_2: { value: 0.3 },
		u_spd_modifier_2: { value: 0.2 },
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
	renderer.domElement.classList.add("animate");
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

	document.addEventListener("scroll", (scrollState) => {
		switch (scrollState.detail) {
			case 0:
				gsap.to(camera.rotation, {
					x: 0,
					y: 0,
					z: 0,
					duration: 3,
				});

				gsap.to(camera.position, {
					z: 2,
					duration: 3,
				});

				break;

			case 1:
				gsap.to(camera.rotation, {
					x: -Math.PI * 0.25,
					y: 0,
					z: 0,
					duration: 3,
				});

				gsap.to(camera.position, {
					z: 1.5,
					duration: 3,
				});

				break;

			case 2:
				gsap.to(camera.rotation, {
					x: -Math.PI * 0.25,
					y: -Math.PI * 0.15,
					z: -Math.PI * 0.2,
					duration: 3,
				});

				gsap.to(camera.position, {
					z: 1.5,
					duration: 3,
				});

				break;

			case 3:
				gsap.to(camera.rotation, {
					x: -Math.PI * 0.25,
					y: 0,
					z: 0,
					duration: 3,
				});

				gsap.to(camera.position, {
					z: 3,
					duration: 5,
				});

				break;
		}
	});
}

{
	let scrollState = 0;
	const maxScroll = document.querySelectorAll("article.page").length - 1;
	const buttonUp = document.querySelector("button.scroll-up");
	const buttonDown = document.querySelector("button.scroll-down");
	const container = document.querySelector("section.page-container");
	const projectsButton = document.querySelector(".projects");
	const contactButton = document.querySelector(".contact");
	const whoamiButton = document.querySelector(".whoami");

	function scroll() {
		const scrollHeight = scrollState * window.innerHeight;

		document.dispatchEvent(new CustomEvent("scroll", { detail: scrollState }));

		container.scroll({
			top: scrollHeight,
			left: 0,
			behavior: "smooth",
		});
	}

	let time = 0;

	document.addEventListener("wheel", (e) => {
		if (Date.now() - time < 500) {
			return;
		}

		if (e.deltaY > 0) {
			if (scrollState < maxScroll) scrollState++;
		} else {
			if (scrollState > 0) scrollState--;
		}

		time = Date.now();
		scroll();
	});

	buttonUp.addEventListener("click", () => {
		if (scrollState > 0) scrollState--;
		scroll();
	});

	buttonDown.addEventListener("click", () => {
		if (scrollState < maxScroll) scrollState++;
		scroll();
	});

	whoamiButton.addEventListener("click", () => {
		scrollState = 1;
		scroll();
	});

	projectsButton.addEventListener("click", () => {
		scrollState = 2;
		scroll();
	});

	contactButton.addEventListener("click", () => {
		scrollState = 3;
		scroll();
	});
}

{
	const Observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
			} else {
				entry.target.classList.remove("visible");
			}
		});
	});

	const targets = document.querySelectorAll(".animate");

	targets.forEach((target) => {
		Observer.observe(target);
	});
}

{
	const cursor = document.querySelector(".cursor-ball");
	const cursorFollower = document.querySelector(".cursor-ball-follower");
	const clickable = document.querySelectorAll("button, a, input, textarea");

	clickable.forEach((element) => {
		element.addEventListener("mouseenter", () => {
			cursor.classList.add("button-hover");
			cursorFollower.classList.add("button-hover");
		});

		element.addEventListener("mouseleave", () => {
			cursor.classList.remove("button-hover");
			cursorFollower.classList.remove("button-hover");
		});
	});

	document.addEventListener("mousemove", (e) => {
		cursor.style.left = `${e.clientX}px`;
		cursor.style.top = `${e.clientY}px`;
		cursorFollower.style.left = `${e.clientX}px`;
		cursorFollower.style.top = `${e.clientY}px`;
	});

	document.addEventListener("mousedown", () => {
		cursorFollower.classList.add("click");
	});

	document.addEventListener("mouseup", () => {
		cursorFollower.classList.remove("click");
	});
}

{
	const FIRST_NAME = "Gaston";
	const LAST_NAME = "Chenet";
	const BIRTH_DATE = "2006-05-17";

	const age = document.querySelectorAll(".age");
	const now = new Date();
	const birth = new Date(BIRTH_DATE);
	const diff = now - birth;
	const ageInYears = Math.floor(diff / 31_557_600_000);

	age.forEach((element) => {
		element.textContent = ageInYears;
	});

	const bigName = document.querySelector(".big-name");
	const glitchChars = Object.freeze([
		"*",
		"!",
		"?",
		"#",
		"$",
		"%",
		"&",
		"@",
		"+",
		"=",
		"-",
		"_",
		"(",
		")",
		"[",
		"]",
		"{",
		"}",
		"<",
		">",
		"~",
		"^",
		":",
		";",
		"|",
		"/",
		"\\",
	]);

	const char = () =>
		glitchChars[Math.floor(Math.random() * glitchChars.length)];

	const expected = FIRST_NAME + " " + LAST_NAME;
	let glitched = "";

	for (let i = 0; i < expected.length; i++) {
		glitched += char();
	}

	let idx = 0;
	bigName.textContent = glitched;
	bigName.dataset.content = glitched;

	const interval = setInterval(() => {
		idx += 0.25;
		let glitched = expected.slice(0, idx);
		console.log(glitched);

		for (let i = 0; i < expected.length - idx; i++) {
			glitched += char();
		}

		bigName.textContent = glitched;
		bigName.dataset.content = glitched;

		if (idx < expected.length) return;
		return clearInterval(interval);
	}, 25);
}
