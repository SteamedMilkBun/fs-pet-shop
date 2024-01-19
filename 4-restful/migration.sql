DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
    id serial,
    age integer,
    kind varchar(20),
    name varchar(20)
);