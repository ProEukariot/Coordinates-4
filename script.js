const createSvg = () => {
	let boundaries;
	var svgNS = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(svgNS, "svg");

	const svgHeight = 400;
	const svgWidth = 950;

	svg.setAttribute("width", svgWidth);
	svg.setAttribute("height", svgHeight);
	document.body.appendChild(svg);

	fetch("cities.json")
		.then((res) => res.json())
		.then((res) => {
			const scale = 50;
			const radius = 4;
			const cities = res.cities;

			let minOffsetX = Infinity;
			let minOffsetY = Infinity;

			cities.forEach((city) => {
				const x = city.coordinates[0];
				const y = city.coordinates[1];

				if (minOffsetX > x) minOffsetX = x;
				if (minOffsetY > y) minOffsetY = y;
			});

			cities.forEach((city) => {
				const x = city.coordinates[0];
				const y = city.coordinates[1];
				const textOffsetX = 10;
				const textOffsetY = 5;
				const marker = document.createElementNS(svgNS, "circle");
				const tooltip = document.createElementNS(svgNS, "text");

				marker.setAttribute("cx", 13 + (x - minOffsetX) * scale);
				marker.setAttribute(
					"cy",
					svgHeight - 22 - (y - minOffsetY) * scale
				);
				marker.setAttribute("stroke", "black");
				marker.setAttribute("fill", "transparent");
				marker.setAttribute("stroke-width", 2);
				// marker.setAttribute("fill", "red");

				marker.setAttribute("r", radius);

				tooltip.setAttribute(
					"x",
					13 + textOffsetX + (x - minOffsetX) * scale
				);
				tooltip.setAttribute(
					"y",
					svgHeight - 22 + textOffsetY - (y - minOffsetY) * scale
				);
				tooltip.setAttribute("id", city.name);
				tooltip.textContent = city.name;
				tooltip.classList.add("animatable");
				tooltip.classList.add("hidden");

				marker.addEventListener("mouseenter", () => {
					const label = document.getElementById(city.name);
					label.classList.remove("hidden");
				});

				marker.addEventListener("mouseleave", () => {
					const label = document.getElementById(city.name);
					label.classList.add("hidden");
				});

				svg.appendChild(tooltip);
				svg.appendChild(marker);
			});
		});

	fetch("world-administrative-boundaries.json")
		.then((res) => res.json())
		.then((res) => {
			boundaries = res;

			const coordinates = boundaries[0].geo_shape.geometry.coordinates[0];

			const scale = 50;
			let minOffsetX = Infinity;
			let minOffsetY = Infinity;

			coordinates.forEach(([x, y]) => {
				if (minOffsetX > x) minOffsetX = x;
				if (minOffsetY > y) minOffsetY = y;
			});

			var path = document.createElementNS(svgNS, "path");

			let pathString = "M ";

			coordinates.forEach(([x, y]) => {
				pathString += `${(x - minOffsetX) * scale} ${
					svgHeight - (y - minOffsetY) * scale
				} `;
			});

			pathString += "Z";

			path.setAttribute("d", pathString);
			path.setAttribute("stroke", "red");
			path.setAttribute("fill", "none");
			path.setAttribute("stroke-width", 2);
			svg.appendChild(path);
		});
};

document.addEventListener("DOMContentLoaded", createSvg);
