console.log('running fs.js');

const command = process.argv[2];

if (command === "read"){
    readPets();
} else if (process.argv.length < 3){
    //displays its usage, ideally to the [standard error], when invoking without subcommand    
    console.log("Usage: node fs.js [read | create | update | destroy]");
}


//The app should [exit the process] with a non-zero exit code to indicate that it failed to complete any work.