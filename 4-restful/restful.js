import express from "express";
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
    // fsPromise.readFile("../pets.json", "utf-8")
    //     .then((text)=>{
    //         res.json(JSON.parse(text));
    //     })
    //     .catch((err)=>{
    //         next(err);
    //     })
});


app.get("/pets/:indexNum", (req, res, next) => {

    const index = Number(req.params.indexNum);

    console.log("Using pet index: ", index);

    fsPromise.readFile("../pets.json", "utf-8")
        .then((text)=>{

            const pets = JSON.parse(text);
            if (!Number.isInteger(index) || index < 0 || index >= pets.length){
                res.sendStatus(404);
                return;
            }
            // respond with single pet at index
            res.json(pets[index]);
        })
        .catch((err)=>next(err));
});


app.post("/pets", (req, res, next) => {
    const age = Number(req.body.age);
    const { name, kind } = req.body;
    // const kind = req.body.kind;

    // TODO make sure name, kind, and age exist, and that age is a number
    if (!name || !kind || Number.isNaN(age) ){
        // return 400
        res.sendStatus(400);
        return;
    }
    console.log(`Creating pet with - Name: ${name}, Age: ${age}, Kind: ${kind}`);
    const pet = {name: name, age: age, kind: kind}
    
    fsPromise.readFile("../pets.json", "utf-8")
        .then((text)=>{ // read pets 
            const pets = JSON.parse(text);
            pets.push(pet);
            return pets;
        })
        .then((pets) => { // write the pets
            return fsPromise.writeFile("../pets.json", JSON.stringify(pets))
        })
        .then(() => {
            console.log("Added new pet to pets.json");
            res.json(pet);
        })
        .catch((err) => {
            next(err);
        });      
})

app.patch('/pets/:indexNum', function(req, res, next){
    const index = Number.parseInt(req.params.indexNum);
    const name = req.body.name;
    console.log("index: ", index)
    console.log("name: ", name);
    if (index.isNaN || !name){
        res.sendStatus(400);
        return;
    }

    let pet = {};
    // We have a integer index, and string name
    fsPromise.readFile("../pets.json", 'utf-8')
        .then((text) => {
            const pets = JSON.parse(text);
            if (index < 0 || index > pets.length - 1){
                res.status = 404;
                res.send("Not Found!");
                return;
            }
            // index OK
            console.log(`Changing pet at index ${index} to name ${name}`);
            pets[index].name = name;
            pet = pets[index];
            return fsPromise.writeFile("../pets.json", JSON.stringify(pets))
        })
        .then(() => {
            console.log("Updated pet: ", pet);
            res.json(pet);
        })
        .catch((err) => {
            // next(err);
            console.error(err);
            res.sendStatus(500);
        })
})

app.delete('/pets/:indexNum', function(req, res, next){
    const index = Number.parseInt(req.params.indexNum);
    console.log("index: ", index)
    if (index.isNaN ){
        res.sendStatus(400);
        return;
    }

    let pet = {};
    // We have a integer index, and string name
    fsPromise.readFile("../pets.json", 'utf-8')
        .then((text) => {
            const pets = JSON.parse(text);
            if (index < 0 || index > pets.length - 1){
                res.status = 404;
                res.send("Not Found!");
                return;
            }
            // index OK
            console.log(`Deleting pet at index ${index}`);
            pet = pets.splice(index, 1);
            return fsPromise.writeFile("../pets.json", JSON.stringify(pets))
        })
        .then(() => {
            console.log("Deleted pet: ", pet);
            res.json(pet);
        })
        .catch((err) => {
            // next(err);
            console.error(err);
            res.sendStatus(500);
        })
})


// internal server error catching middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
});

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
});