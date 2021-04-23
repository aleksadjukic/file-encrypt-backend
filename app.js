const crypto = require("crypto");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const upload = require("express-fileupload");
const generateKeys = require("./helpers/generateKeys");
let keys = generateKeys();
const iv = crypto.randomBytes(16);

const app = express();

app.use(cors());
app.use(upload());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/generateKeys", (req, res) => {
	res.json(keys);
});

app.post("/api/encrypt", (req, res) => {
	try {
		const { fileToEncrypt } = req.files;
		const { key } = req.body;

		let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

		let encrypted = cipher.update(fileToEncrypt.data);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		var fileContents = Buffer.from(encrypted, "base64");
		console.log(fileContents);
		res.json({ name: fileToEncrypt.name, fileContents });
	} catch (error) {
		res.status(400).json({ status: "fail", message: "Bad request" });
	}
});

app.post("/api/decrypt", (req, res) => {
	try {
		const { fileToDecrypt } = req.files;
		const { key } = req.body;

		let cipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);

		let decrypted = cipher.update(fileToDecrypt.data);
		decrypted = Buffer.concat([decrypted, cipher.final()]);

		var fileContents = Buffer.from(decrypted, "base64");
		console.log(fileContents);
		res.json({ name: fileToDecrypt.name.replace('.enc', ''), fileContents });
	} catch (error) {
		res.json({ status: "fail", message: "Bad decryption attempt. Try another key!" });
	}
});

app.listen(8080, () => {
	console.log("Listening on port 8080");
});
