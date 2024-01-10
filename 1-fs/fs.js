import fs from "node:fs";

const command = process.argv[2];
const subcommand = process.argv[3];

if (command === "read"){
    readPets();
} else if (command === "create"){
    createPets();
} else if (process.argv.length < 3){
    //displays its usage, ideally to the [standard error], when invoking without subcommand    
    console.error("Usage: node fs.js [read | create | update | destroy]");
}

function readPets(){
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
                //exit with nonzero exit code?
            }
        } else {
            //display all petInfo
            console.log(petInfo);
        }
    })
}

function createPets(){
    
}

//The app should [exit the process] with a non-zero exit code to indicate that it failed to complete any work.