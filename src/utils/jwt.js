const jwt = require("jsonwebtoken");

exports.kreirajToken = function (korisnik, tajniKljucJWT, jwtValjanost) {
	console.log("Valjanost: " + jwtValjanost);
    console.log("Korisnik: " + JSON.stringify(korisnik));
	let token = jwt.sign({ username: korisnik.username }, tajniKljucJWT, {
		expiresIn: jwtValjanost + "s",
	});
	return token;
};

exports.provjeriToken = function (zahtjev, tajniKljucJWT) {
	console.log("Provjera tokena: " + zahtjev.headers.authorization);
	if (zahtjev.headers.authorization != null) {
		console.log(zahtjev.headers.authorization);
		let token = zahtjev.headers.authorization.split(" ")[1];
		try {
			let podaci = jwt.verify(token, tajniKljucJWT);
		    console.log("JWT podaci: " + JSON.stringify(podaci));
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
	return false;
};

exports.dajTijeloTokena = function (zahtjev) {
	let token = zahtjev.headers.authorization;
	let dijelovi = token.split(".");
	let tijelo = JSON.parse(dekodirajBase64(dijelovi[1]));
	console.log("Vracam tijelo tokena:" + JSON.stringify(tijelo));
	return tijelo;
};

function dekodirajBase64(data) {
	let buff = Buffer.from(data, "base64");
	return buff.toString("ascii");
}