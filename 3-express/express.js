import express from "express";
import fs from "fs";

const PORT = 8000;

const app = express();
app.use(express.json());

app.get("/pets", (req, res) => {
    console.log('/pets request called \nshow all pets');

    fs.readFile('../petsCopy.json', 'utf-8', (error, jsonData) => {
        if(error){
            console.error(error);
            res.sendStatus = 500;
            res.end('Ending response');
            return;
        }
        res.json(json.parse(jsonData));  
    })
    
});

app.get("/pets/:index", (req, res) => {
    const index = Number(req.params.index);
    console.log(`/pets/:index request called 
                \nshow pet at index: ${index} | typeof: ${typeof index}`);
    res.json('pet shown at index');
});

app.post("/pets", (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const kind = req.body.kind;
    console.log(`Creating pet with - Name: ${name}, Age: ${age}, Kind: ${kind}`);
    const pet = {name, age, kind};

    fs.writeFile('../petsCopy.json', JSON.stringify(pet), (error) => {
        
    })
    // TODO - alter pets.json to add the new pet
    res.json(pet)
})

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});