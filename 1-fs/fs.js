import fs from "node:fs";

const command = process.argv[2];

if (command === "read"){
    readPets();
} else if (command === "create"){
    createPets();
} else if (process.argv.length < 3){
    //displays its usage, ideally to the [standard error], when invoking without subcommand    
    console.error("Usage: node fs.js [read | create | update | destroy]");
}

function readPets(){
    const subcommand = Number(process.argv[3]);
    //get data frp, pets.json using fs.readFile
    fs.readFile('../pets.json', 'utf-8', (error, fileData) => {
        if (error){
            throw(error);
        } 
        //convert pets.json into js object
        const petInfo = JSON.parse(fileData);

        //if index 3 at process.argv is defined AKA any 'subcommand' is defined
        if (subcommand){
            //console.log(`subcommand: ${subcommand}| petInfo length: ${petInfo.length}`);
            //if valid subcommand (index in this case)
            if (subcommand <= petInfo.length && subcommand > 0){
                console.log(petInfo[subcommand - 1]);
            } else {
                //display usage code
                console.error("Usage: node fs.js read INDEX, index must be an integer within petInfo.length");
                process.exit(1);
            }
        } else {
            //display all petInfo
            console.log(petInfo);
        }
    })
}

function createPets(){
    const age = process.argv[3];
    const kind = process.argv[4];
    const name = process.argv[5];
    //get data from pets.json using fs.readFile
    fs.readFile('../petsCopy.json', 'utf-8', (error, fileData) => {
        if (error){
            throw(error);
        } 

        //convert pets.json into js object
        const petInfo = JSON.parse(fileData);

    //if subcommand is integer, sc2 and sc3 are strings...
        if (Number.isInteger(age) && typeof kind === "string" && typeof name === "string"){
            //create object for all subcommands as values in key:value pairs
            const newPet = { age, kind, name };
            petInfo.push(newPet);
            console.log(petInfo);
            //stringify newPet into json string

            fs.writeFile('../petsCopy.json', JSON.stringify(petInfo), (error) => {
                if (error) {
                    throw(error);  
                } else {
                console.log("File written successfully:");
                console.log(newPet);
              }
            })
        } else {
            //display usage code
            console.error("Usage: node fs.js create AGE KIND NAME");
            process.exit(1);
        }
    })
}
