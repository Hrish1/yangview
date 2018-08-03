#!/usr/bin/env node


//var request = require('request');
 var fs = require('fs');
 var chalk = require('chalk');
 var yangtree;

 rest = {
  options : {
  url: 'http://admin:admin@localhost:8181/restconf',
  headers: {
    'Accept': 'application/json', 'Content-Type':'application/xml'
  }

},
 callback: (error, response, body)=> {
  if(response){
    if (!error && response.statusCode == 200) {
       yangtree = body;
       fs.writeFile('./yang.json', yangtree, function(err){
          if(err){
              console.log(err.code);
          }
          else{
            console.log(chalk.green('File was written \n'));
          }
       });
       console.log(chalk.green("Your Yang tree was successfully buffered\n"));
    }
    else{
      console.log(chalk.red(response.statusCode));
      process.exit();
    }
  }
  else{
    console.log(chalk.red('No response was received, make sure your controller is running and supports RESTCONF'));
  }
}

};

module.exports = {
  rest,
  yangtree
};

//request(options, callback);

