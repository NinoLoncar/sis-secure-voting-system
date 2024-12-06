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

DELETE FROM voters;
INSERT INTO voters (username, email, password, voted) 
VALUES ('admin','fusion.project.management.app@gmail.com','$2a$12$w4MoQkvClE3iv6.oCp9hue74ZYSNqVkg8h8PEt7xLJ4EtyaYiw.aq', FALSE);

CREATE TABLE votes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
signature TEXT NOT NULL,
encrypted_vote NOT NULL
);

CREATE TABLE candidates (
id INTEGER PRIMARY KEY AUTOINCREMENT,
first_name varchar(100) NOT NULL,
last_name varchar(100) NOT NULL,
party varchar(150) NOT NULL,
image_url TEXT DEFAULT NULL,
vote_count INTEGER DEFAULT 0
);


INSERT INTO candidates (first_name, last_name, party, image_url) 
VALUES ('Walter','White','The danger','https://i.pinimg.com/originals/b7/76/a7/b776a7801a57a22a00b8859f6e2c746c.jpg'),
('Gustavo','Fring','Los pollos hermanos', 'https://i.namu.wiki/i/euH86A9h57zvltz6Vn9PaB-R1lXomWwf2DAMJdUXZvvAMbT9BN4qjXlOLSbXNdVVZwMSPkRLpMTiYekBTf7Uxg.webp'),
('Hank','Schrader','DEA', 'https://images.genius.com/b0e98e4337eb9db45433b092a409b10b.1000x1000x1.png'),
('Hector','Salamanca','Cartel', 'https://i.namu.wiki/i/h0yJ3FsmlGFPDUoTNbXGzFXsu6KmSiO_L95xqPDgQZKaEG60pvL79BmFfuAbajxYJKSdOjlXYWvbPzgEEr28aA.webp');


SELECT * FROM voters;
SELECT * FROM candidates;
SELECT * FROM votes;
