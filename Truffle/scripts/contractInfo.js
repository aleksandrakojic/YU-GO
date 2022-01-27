var fs = require('fs');

fs.copyFile('build/contracts/YugoDao.json', '../src/contracts/YugoDao.json', (err) => {
	if (err) throw err;
	console.log("✅ Your contract's ABI was copied to the frontend");
});

fs.copyFile('build/contracts/YugoManager.json', '../src/contracts/YugoManager.json', (err) => {
	if (err) throw err;
	console.log("✅ Your contract's ABI was copied to the frontend");
});

fs.copyFile('build/contracts/Yugo.json', '../src/contracts/Yugo.json', (err) => {
	if (err) throw err;
	console.log("✅ Your contract's ABI was copied to the frontend");
});
fs.copyFile(
	'build/contracts/VerifySignature.json',
	'../src/contracts/VerifySignature.json',
	(err) => {
		if (err) throw err;
		console.log("✅ Your contract's ABI was copied to the frontend");
	}
);
fs.copyFile('build/contracts/GrantEscrow.json', '../src/contracts/GrantEscrow.json', (err) => {
	if (err) throw err;
	console.log("✅ Your contract's ABI was copied to the frontend");
});
