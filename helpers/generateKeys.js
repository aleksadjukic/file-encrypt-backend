const crypto = require("crypto");

function generateKeys() {
	let keys = [];
	for (let i = 1; i <= 10; i++) {
		let secret = `superSecretSecrethere!-${i}`;
    
		let key = crypto.createHash("sha256").update(String(secret)).digest("base64").substr(0, 32);
		keys.push(key);
	}
	return keys;
}

module.exports = generateKeys;
