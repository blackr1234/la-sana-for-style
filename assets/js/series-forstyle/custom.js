const LOGO_URL = "../../assets/image/smn-logo.svg";

function popImage(imgElement) {
	if (!(imgElement instanceof HTMLImageElement)) return;

	// 1. Initialize loaders for both images
	const preloader = new Image();
	preloader.draggable = false;
	const logoLoader = new Image();
	logoLoader.draggable = false;

	preloader.src = imgElement.src;
	logoLoader.src = LOGO_URL;

	const startAnimation = () => {
		const overlay = document.createElement("div");
		overlay.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:999999; display:flex; align-items:center; justify-content:center; transition:background 0.3s ease;`;
		document.body.appendChild(overlay);

		const rect = imgElement.getBoundingClientRect();
		const container = document.createElement("div");
		container.style.cssText = `position:fixed; left:${rect.left}px; top:${rect.top}px; width:${rect.width}px; height:${rect.height}px; z-index:1000000; transition:all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);`;
		overlay.appendChild(container);

		// Final Image Setup
		preloader.style.cssText = `position:absolute; inset:0; width:100%; height:100%; opacity:0; transform:scale(0.5); border-radius: 30px; transition:all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); object-fit: cover;`;
		container.appendChild(preloader);

		// Mystery Box Setup
		const box = document.createElement("div");
		box.style.cssText = `position:absolute; inset:0; background: #FFFFFF; border:4px solid #FFD700; border-radius:20px; box-shadow:0 0 30px rgba(255, 215, 0, 0.6); display:flex; align-items:center; justify-content:center; animation:shake 0.5s ease-in-out 0.5s 3; z-index:2; overflow:hidden;`;

		// Use the already-loaded logoLoader element
		logoLoader.style.cssText = `width: 100%; height: 100%; object-fit: contain; padding: 10px;`;
		box.appendChild(logoLoader);
		container.appendChild(box);

		if (!document.getElementById("shakeKeyframes")) {
			const style = document.createElement("style");
			style.id = "shakeKeyframes";
			style.textContent = `@keyframes shake { 0%,100%{transform:rotate(0deg)} 10%,30%,50%,70%,90%{transform:rotate(-5deg)} 20%,40%,60%,80%{transform:rotate(5deg)} }`;
			document.head.appendChild(style);
		}

		requestAnimationFrame(() => {
			container.style.left = "50%";
			container.style.top = "50%";
			container.style.transform = "translate(-50%, -50%) scale(1.2)";
		});

		// REVEAL LOGIC
		setTimeout(() => {
			box.style.display = "none";
			const particleCount = 40;
			const colors = ["#FF007F", "#00E5FF", "#70FF00", "#FFD700", "#FF5F00", "#BF00FF"];

			for (let i = 0; i < particleCount; i++) {
				const fragment = document.createElement("div");
				const angle = (Math.PI * 2 * i) / (particleCount / 2);
				const velocity = 200 + Math.random() * 300;
				const size = 12 + Math.random() * 28;
				const color = colors[Math.floor(Math.random() * colors.length)];
				fragment.style.cssText = `position: absolute; left: 50%; top: 50%; width: ${size}px; height: ${size}px; background: ${color}; border-radius: ${Math.random() > 0.5 ? "50%" : "4px"}; box-shadow: 0 0 20px ${color}; transform: translate(-50%, -50%); opacity: 1; z-index: 3; pointer-events: none; transition: transform 1.5s cubic-bezier(0.1, 0.5, 0.2, 1), opacity 1.5s ease-out;`;
				container.appendChild(fragment);
				void fragment.offsetHeight;
				fragment.style.transform = `translate(-50%, -50%) translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) rotate(${Math.random() * 720}deg) scale(0)`;
				fragment.style.opacity = "0";
				setTimeout(() => fragment.remove(), 1600);
			}

			requestAnimationFrame(() => {
				preloader.style.opacity = "1";
				preloader.style.transform = "scale(1)";
				preloader.style.filter = "brightness(1.1) drop-shadow(0 0 50px white)";
				container.style.transform = "translate(-50%, -50%) scale(1.6)";
			});
		}, 2000);

		setTimeout(() => {
			overlay.style.opacity = "0";
			overlay.style.transition = "opacity 0.8s ease";
			setTimeout(() => overlay.remove(), 800);
		}, 4000);
	};

	// 2. Wait for BOTH images to load before starting anything
	// Based on Promise.all logic from [MDN Web Docs](https://developer.mozilla.org)
	Promise.all([
		new Promise((res) => (preloader.complete ? res() : (preloader.onload = res))),
		new Promise((res) => (logoLoader.complete ? res() : (logoLoader.onload = res))),
	]).then(startAnimation);
}
