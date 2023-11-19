# launch-mk2
Basic module for interact with Launchpad Mk2 that just work

## Example
```javascript
const lp = require('launch-mk2');

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

//initialize launchpad
lp.init();

//what to do when button is pressed
lp.onBtnPress((btn, xy, time)=>{
	const randHex = randomColor();
	//set color for one button
	lp.setColor(xy[0], xy[1], randHex);
});

//what to do when button is release
lp.onBtnRelease((btn, xy, time)=>{
	//turn off color for one button
	lp.setColor(xy[0], xy[1], 0);
});

//set colors for multiple buttons at once
lp.setColors([
	[0],
	[0,'#ff0000'],
	[0,0,'#00f000'],
	['#ffffff','#ffff00', '#00f0f0']
]);

process.on('SIGINT', function() {
	//turn off all buttons when exit process
	lp.close();
	process.exit();
});

```