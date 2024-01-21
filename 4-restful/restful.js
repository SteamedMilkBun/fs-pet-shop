import express, { query } from "express";
import fs from "fs";
import pg from "pg";

const fsPromise = fs.promises;

const PORT = 8001;

const pool = new pg.Pool({
    host: "localhost",
    port: 6432,
    user: "postgres",
    password: "postgres",
    database: "petshop"
});

const app = express();
// middleware to accept json as request body
app.use(express.json());

app.get("/pets", (req, res, next) => {
    pool.query('SELECT * FROM pets')
    .then((data) => {
        console.log(data.rows);
        res.json(data.rows);
    })
    .catch((err) => {
        console.log("error querying from pets db");
        res.sendStatus(500);
    });
});


app.get("/pets/:indexNum", (req, res, next) => {
    const petId = Number.parseInt(req.params.indexNum);
    console.log(`Using petId: ${petId}`);
    pool.query(`SELECT name, kind, age FROM pets WHERE id = $1`, [petId])
    .then((data) => {
        if (data.rows.length == 0) {
            res.sendStatus(404);
            return;
        }
        console.log(data.rows[0]);
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
});


app.post("/pets", (req, res, next) => {
    const age = Number(req.body.age);
    const name = req.body.name;
    const kind = req.body.kind;

    // TODO make sure name, kind, and age exist, and that age is a number
    if (!name || !kind || Number.isNaN(age) ){
        // return 400
        res.sendStatus(400);
        return;
    }
    console.log(`Creating pet with - Name: ${name}, Age: ${age}, Kind: ${kind}`);
    //const pet = {name: name, age: age, kind: kind}
    
    pool.query(`INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3) RETURNING *`,
        [name, kind, age])
        .then((data) => {
            console.log(data.rows[0]);
            const newPet = data.rows[0];
            delete newPet.id;
            res.json(newPet);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
 })

app.patch('/pets/:indexNum', function(req, res){
    //patch request come in the form of an object, the info we want is in req.body
    //assign const index the value of indexNum from user patch request
    const queryForWHERE = Number.parseInt(req.params.indexNum);
    const name = req.body.name;
    const age = req.body.age;
    const kind = req.body.kind;
    let queryStringForSET;
    console.log(`Requested to edit pet @ petId: ${queryForWHERE}`);
    console.log(`Requested name: ${name}, kind: ${kind}, age: ${age}`);
    // console.log("Requested age: ", age);
    // console.log("Requested kind: ", kind);
    if (queryForWHERE.isNaN || !queryForWHERE > 0){//if index is NaN or name doesnt exist
        res.sendStatus(400);
        return;
    }
    //handle bad requests, set conditions for number of columns queried
    if (name) {
        if (!typeof name === 'string') {//check format
            console.log(`Bad request \nName: '${name}' is not a string`)
            res.sendStatus(400);
            return
        } else {// if name does exist
            queryStringForSET = `name = '${name}'`;//name = Fido UPDATE pets SET name = Fido WHERE 
            console.log(`Name exists, current query string for SET: ${queryStringForSET}`);
        }
        //`UPDATE pets SET $1 WHERE id = $2`, [queryStringForSET, petId]
    }
    if (age) {
        if (!Number.isInteger(age)) {
            console.log(`Bad request \nAge: ${age} is not an integer`);
            res.sendStatus(400);
            return
        } else {//if age IS an integer
            if (name) {//if theres name and age, separate with comma (psql syntax for update)
                queryStringForSET += `, age = ${age}`;
                console.log(`Age and name exist, current query string for SET: ${queryStringForSET}`);
            } else {
            queryStringForSET = `age = ${age}`;
            console.log(`Only age exists, current query string for SET: ${queryStringForSET}`);
            }
        }
    }
    if (kind) {
        if (!typeof kind === 'string') {
            console.log(`Bad request \nKind: '${kind}' is not a string`);
            res.sendStatus(400);
            return
        } else {
            if (name || age) {
                queryStringForSET += `, kind = '${kind}'`; //SET column1 = value1, column2 = value2, ...
                //(name) queryString = `name = ${name}`
                //also (age) queryString = `name = ${name}, `
                    //`name = ${name}, age = ${age} ...`
                    //UPDATE pets SET name = ${name}, age = ${age} ... WHERE id = petId
                    //template literals $1, $2 [queryStringForSET, petId]
                console.log(`Kind, (age and/or name exists), current query string for SET: ${queryStringForSET}`);
            } else {
            queryStringForSET += `kind = ${kind}`;
            console.log(`Current query string for SET: ${queryStringForSET}`);
            }
        }
    }
    console.log(`After all conditions, query string for SET: ${queryStringForSET}`);
    //if index is number and name exists, get pet info at index to update
    //create object and assign current properties from req.body for editing
    pool.query(`UPDATE pets SET ${queryStringForSET} WHERE id = $1 RETURNING *`, [queryForWHERE])
    .then((data) => {
        if (data.rows.length == 0) {//if no data returned from query, not found
            res.sendStatus(404);
            return;
        }
        console.log('returning edited pet: ', data.rows[0]);
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})
            
app.delete('/pets/:indexNum', function(req, res){
    const queryForWHERE = Number.parseInt(req.params.indexNum);
    console.log("WHERE: ", queryForWHERE)
    if (queryForWHERE.isNaN || !queryForWHERE > 0){//if index is NaN or <= 0, bad request
        res.sendStatus(400);
        return;
    }
    //if good request, delete at queryForWHERE
    pool.query(`DELETE FROM pets WHERE id = $1`, [queryForWHERE])
    .then((data) => {
        console.log(`Deleted data where id = ${queryForWHERE}`);
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})
            
app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
});