DROP TABLE voters;
DROP TABLE candidates;
DROP TABLE votes;

CREATE TABLE voters (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username VARCHAR(30) NOT NULL,
email VARCHAR(255) NOT NULL,
password TEXT NOT NULL,
voted BOOLEAN NOT NULL
);

INSERT INTO voters (username, email, password, voted) 
VALUES ('admin','admin','admin', FALSE);

CREATE TABLE votes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
signature TEXT NOT NULL,
vote NOT NULL
);

CREATE TABLE candidates (
id INTEGER PRIMARY KEY AUTOINCREMENT,
first_name varchar(100) NOT NULL,
last_name varchar(100) NOT NULL,
party varchar(150) NOT NULL
);

INSERT INTO candidates (first_name, last_name, party) 
VALUES ('Walther','White','The danger'), 
('Gustavo','Fring','Los pollos hermanos'),
('Hank','Schrader','DEA'),
('Hector','Salamanca','Cartel');


SELECT * FROM voters;
SELECT * FROM candidates;