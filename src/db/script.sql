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

ALTER TABLE candidates
ADD COLUMN image_url TEXT DEFAULT NULL;



DELETE FROM voters;
INSERT INTO voters (username, email, password, voted) 
VALUES ('admin','karlomilos7@gmail.com','$2a$12$w4MoQkvClE3iv6.oCp9hue74ZYSNqVkg8h8PEt7xLJ4EtyaYiw.aq', FALSE);


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

INSERT INTO voters (username, email, password, voted) 
VALUES ('user','karlomilos7@gmail.com','admin', FALSE);




INSERT INTO candidates (first_name, last_name, party, image_url) 
VALUES ('Walter','White','The danger','https://i.pinimg.com/originals/b7/76/a7/b776a7801a57a22a00b8859f6e2c746c.jpg'),
('Gustavo','Fring','Los pollos hermanos', 'https://i.namu.wiki/i/euH86A9h57zvltz6Vn9PaB-R1lXomWwf2DAMJdUXZvvAMbT9BN4qjXlOLSbXNdVVZwMSPkRLpMTiYekBTf7Uxg.webp'),
('Hank','Schrader','DEA', 'https://images.genius.com/b0e98e4337eb9db45433b092a409b10b.1000x1000x1.png'),
('Hector','Salamanca','Cartel', 'https://i.namu.wiki/i/h0yJ3FsmlGFPDUoTNbXGzFXsu6KmSiO_L95xqPDgQZKaEG60pvL79BmFfuAbajxYJKSdOjlXYWvbPzgEEr28aA.webp');

DELETE FROM candidates;

UPDATE candidates
SET image_url = 'https://wallpaperaccess.com/full/9176760.jpg'
WHERE first_name = 'Hector';


SELECT * FROM voters;
SELECT * FROM candidates;



-- 1. Kreiranje nove tabele bez kolone `image_url`
CREATE TABLE voters_new AS
SELECT id, username, email, password, voted
FROM voters;

-- 2. Preimenovanje stare tabele za sigurnost (opciono)
ALTER TABLE voters RENAME TO voters_old;

-- 3. Preimenovanje nove tabele na ime originalne
ALTER TABLE voters_new RENAME TO voters;

-- 4. Opcionalno: Brisanje stare tabele ako je sve ispravno prebačeno
DROP TABLE voters_old;