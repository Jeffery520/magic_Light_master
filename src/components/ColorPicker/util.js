const colorRGB2Hex = function (r, g, b) {
	r = parseInt(r);
	g = parseInt(g);
	b = parseInt(b);
	let hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	return hex;
};

const rgb2hsl = function (r, g, b) {
	(r /= 255), (g /= 255), (b /= 255);
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h,
		s,
		l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return [h, s, l];
};

const hslToRgb = function (h, s = 1, l = 0.5) {
	var r, g, b;
	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const drawRing = function (ctx, width, height, dpr) {
	// 画圆环
	var radius = parseInt(width / 2);
	var colorWheelNumber = 36;
	var step = 360 / colorWheelNumber;
	for (let i = 0; i < colorWheelNumber; i++) {
		let color = hslToRgb((i * step) / 360, 1, 0.5);
		ctx.beginPath();
		ctx.moveTo(radius, radius);
		ctx.arc(
			radius,
			radius,
			radius,
			((Math.PI * 2) / colorWheelNumber) * i,
			((Math.PI * 2) / colorWheelNumber) * (i + 1) + 0.01
		);
		ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
		ctx.fill();
		ctx.closePath();
	}

	ctx.beginPath();
	ctx.lineWidth = dpr;
	ctx.arc(radius, radius, radius - dpr / 2, 0, 2 * Math.PI);
	ctx.strokeStyle = 'rgba(255, 255, 255,0.2)';
	ctx.stroke();

	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.strokeStyle = 'rgba(255, 255, 255,0.2)';
	ctx.beginPath();
	ctx.arc(radius, radius, radius * 0.55, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};

const drawSlider = function (ctx, width, height, angle, dpr, image) {
	let radius = parseInt(width / 2);
	ctx.save();
	ctx.clearRect(0, 0, width, height);
	let color = hslToRgb(angle, 1, 0.5);

	let toRad = (2 * Math.PI) / 360;
	let step = 10;

	ctx.translate(radius, radius);
	ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
	ctx.beginPath();
	ctx.shadowBlur = 10;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
	ctx.arc(0, 0, radius * 0.46, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	ctx.rotate((angle * 360 * Math.PI) / 180);

	ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
	ctx.strokeStyle = 'rgb(255, 255, 255)';
	ctx.lineWidth = dpr;
	ctx.beginPath();
	//圆心的 x 坐标  , 圆心的 Y 坐标 , 圆的半径
	ctx.arc(height * 0.38, 20, 25, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.restore();
};

module.exports = {
	colorRGB2Hex: colorRGB2Hex,
	rgb2hsl: rgb2hsl,
	hslToRgb: hslToRgb,
	drawRing: drawRing,
	drawSlider: drawSlider
};
