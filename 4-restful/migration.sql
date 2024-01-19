DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    age NUMBER,
    kind VARCHAR(20),
    name VARCHAR(20)
);