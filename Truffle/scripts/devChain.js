const { spawn } = require('child_process');

const run = () => {
	console.log('🚀 Starting local dev chain...');
	try {
		spawn('ganache -d --db data -i 5777 --port 7545', {
			shell: true,
			stdio: 'inherit',
		});
	} catch (e) {
		console.log(e);
	}
};
run();
