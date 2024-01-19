import express from "express";
import fs from "fs";
import pg from "pg";
const fsPromise = fs.promises;

const PORT = 8001;

const app = express();
// middleware to accept json as request body
app.use(express.json());

app.get("/petsCopy", (req, res, next) => {
    fsPromise.readFile("../petsCopy.json", "utf-8")
        .then((text)=>{
            res.json(JSON.parse(text));
        })
        .catch((err)=>{
            next(err);
        })
    });


app.get("/petsCopy/:indexNum", (req, res, next) => {

    const index = Number(req.params.indexNum);

    console.log("Using pet index: ", index);

    fsPromise.readFile("./petsCopy.json", "utf-8")
        .then((text)=>{

            const petsCopy = JSON.parse(text);
            if (!Number.isInteger(index) || index < 0 || index >= petsCopy.length){
                res.sendStatus(404);
                return;
            }
            // respond with single pet at index
            res.json(petsCopy[index]);
        })
        .catch((err)=>next(err));
});


app.post("/petsCopy", (req, res, next) => {
    console.log(req.body);
    const age = Number(req.body.age);
    const { name, kind } = req.body;

    // TODO make sure name, kind, and age exist, and that age is a number
    if (!name || !kind || Number.isNaN(age) ){
        // return 400
        res.sendStatus(400);
        return;
    }
    console.log(`Creating pet with - Name: ${name}, Age: ${age}, Kind: ${kind}`);
    const pet = {name: name, age: age, kind: kind}
    
    fsPromise.readFile("../petsCopy.json", "utf-8")
        .then((text)=>{ // read petsCopy 
            const petsCopy = JSON.parse(text);
            petsCopy.push(pet);
            return petsCopy;
        })
        .then((petsCopy)=>{ // write the petsCopy
            return fsPromise.writeFile("../petsCopy.json", JSON.stringify(petsCopy))
        })
        .then(() => {
            console.log("Added new pet to petsCopy.json");
            res.json(pet);
        })
        .catch((err) => {
            next(err);
        });
        
});

app.patch("/petsCopy/:indexNum", (req, res) => {
    //get indexNum from user input in URL
    let indexNum = Number(req.params.indexNum);
    //readFile then writeFile to change property at indexNum
    fsPromise.readFile("../petsCopy.json", "utf-8")
    .then((text)=>{
        const petsCopy = JSON.parse(text);
        if (!Number.isInteger(index) || index < 0 || index >= petsCopy.length){
            console.log(`Bad index number: ${index}`)
            res.sendStatus(404);
            return;
        }
        let petToUpdate = petsCopy[index];
        return petToUpdate; //pass petToUpdate to next function for edit
    })
        .then((petToUpdate) => {//edit the property at indexNum
            fsPromise.writeFile()
        })
});

// internal server error catching middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
});

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
});