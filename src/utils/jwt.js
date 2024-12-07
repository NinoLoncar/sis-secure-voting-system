const jwt = require("jsonwebtoken");

exports.generateJwtToken = function (user, jwtSecretKey, jwtValidity) {
	let token = jwt.sign({ username: user.username }, jwtSecretKey, {
		expiresIn: jwtValidity + "s",
	});
	return token;
};

exports.verifyToken = function (request, jwtSecretKey) {
	if (request.headers.authorization != null) {
		let token = request.headers.authorization.split(" ")[1];
		try {
			let data = jwt.verify(token, jwtSecretKey);
			return true;
		} catch (e) {
			return false;
		}
	}
	return false;
};

exports.getJwtPayload = function (request) {
	let token = request.headers.authorization;
	let tokenParts = token.split(".");
	let decodedPayload = JSON.parse(decodeBase64(tokenParts[1]));
	return decodedPayload;
};

function decodeBase64(data) {
	let buff = Buffer.from(data, "base64");
	return buff.toString("ascii");
}