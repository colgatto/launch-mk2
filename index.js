const midi = require('midi');

let output = null;
let input = null;

const makeSys = data => [240, 0, 32, 41, 2, 24, ...data, 247]

const init_inp = () => {
	input = new midi.Input();
	input.on('message', (time, data) => {
		if(data[2] == 127) btnPress(data[1], xyFromBtn(data[1]), time);
		else btnRelease(data[1], xyFromBtn(data[1]), time);
	});
	const n = input.getPortCount();
	for (let i = 0; i < n; i++) {
		if(input.getPortName(n-1).match(/launchpad/i)){
			input.openPort(n-1);
			input.ignoreTypes(false, false, false);	
			return input;
		}
	}
	return null;
};

const init_out = () => {
	output = new midi.Output();
	const n = output.getPortCount();
	for (let i = 0; i < n; i++) {
		if(output.getPortName(n-1).match(/launchpad/i)){
			output.openPort(n-1);
			return output;
		}
	}
	return null;
};

const init = () => {
	init_inp();
	init_out();
}

const close = () => {
	output.sendMessage(makeSys([14, 0]));
	output.closePort();
};

const xyFromBtn = btn => {
	if (btn >= 104) return [btn - 104, 0];
	let tmp =  Math.floor(btn / 10);
	return [btn - tmp * 10 - 1, 9 - tmp];
};

const btnFromXY = (x, y) => {
	if (y === 0) return x + 104;
	return 91 - (10 * y) + x;
};

const colorFromHex = (hex) => {
	let r = (parseInt(hex.slice(1, 3), 16) / 255) * 63;
	let g = (parseInt(hex.slice(3, 5), 16) / 255) * 63;
	let b = (parseInt(hex.slice(5, 7), 16) / 255) * 63;
	return [r,g,b];
}

const setColor = (x, y, color) => {
	let c = color ? colorFromHex(color) : [0, 0, 0];
	output.sendMessage(makeSys([11, btnFromXY(x, y), ...c]));
};

const setColors = (m) => {
	for (let i = 0; i < m.length; i++) {
		for (let j = 0; j < m[i].length; j++) {
			const v = m[i][j];
			let c = v ? colorFromHex(v) : [0, 0, 0];
			output.sendMessage(makeSys([11, btnFromXY(j, i), ...c]));
		}
	}
};

const flashColor = (x, y, color) => {
	let c = color ? colorFromHex(color) : [0, 0, 0];
	output.sendMessage(makeSys([35, 0, btnFromXY(x, y), ...c]));
};

const pulseColor = (x, y, color) => {
	let c = color ? colorFromHex(color) : [0, 0, 0];
	output.sendMessage(makeSys([40, 0, btnFromXY(x, y), ...c]));
};

let btnPress = (btn, xy, time) => { };
let btnRelease = (btn, xy, time) => { };

const onBtnPress = cb => { btnPress = cb; };
const onBtnRelease = cb => { btnRelease = cb; };


module.exports = {
	init,
	onBtnPress,
	onBtnRelease,
	setColor,
	setColors,
	flashColor,
	pulseColor,
	close
};