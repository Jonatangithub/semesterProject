CREATE TABLE "Users" (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text,
    name text,
    password text
);
CREATE TABLE Stats (
    userId INT REFERENCES "Users"(id),
    wins INT,
    losses INT,
    draws INT
);