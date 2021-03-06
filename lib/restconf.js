/*
MIT License

Copyright (c) 2018 Hrishav Mukherjee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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

