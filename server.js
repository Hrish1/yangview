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

	//var commander = require('commander');

	var chalk = require('chalk');
	var clear = require('clear');
	var figlet = require('figlet');
	var inquirer = require('inquirer');
	var {rest, yangtree} = require('./lib/restconf');
	var request = require('request');
	var program = require('commander');
	var fs = require('fs');
	var yangtree;
	clear();

	console.log(
		chalk.green(
			figlet.textSync('Yangview', { horizontalLayout: 'full' })

			)

		);


	const questions = [
	{
		name: 'Datastore',
		type: 'input',
		message: 'Enter the datastore, operational or config' ,
		validate: function(value){

			return (value.trim().toLowerCase()==='config' || value.trim().toLowerCase()==='operational');
		}
	},
	{
		name: 'Module',
		type: 'input',
		message: 'Enter the module name eg. opendaylight-inventory' ,
		validate: function(value){
			return true;
		}
	},
	{
		name: 'Node',
		type: 'input',
		message: 'Enter the yang model',
		validate: function(value){
			return true;
		}

	}

	];
	
	program
	.command('connect')
	.description('Connect to restconf')
	.action(() => {
		inquirer.prompt(questions).then((answers) => {
			var Datastore = '/' + answers.Datastore.trim();
			var Module = '/' + answers.Module.trim();
			var Node = ':' + answers.Node.trim(); 
			var options = rest.options;
			var callback = rest.callback; 
			options.url = options.url + Datastore + Module + Node;
			console.log('Request made to',chalk.yellow(options.url));
			request(options,callback)
		})
	});
	
	program
	.command('list')
	.description('List the accessible nodes')
	.action(() => {
		fs.readFile('./yang.json',  function(err,data) {
			if(!data  ||  err){
				console.log(err);
				console.log('You must reconnect to Restconf\n');
			}

			yangtree = JSON.parse(data);
			var listitem = Object.keys(yangtree);
			if(String(data).charAt(0) == '['){
				for( var i=0; i<listitem.length; i++){

					for( var key in yangtree[listitem[i]]){
						if(yangtree[listitem[i]].hasOwnProperty(key)){
							console.log(listitem[i]+':'+chalk.yellow(yangtree[listitem[i]][key]));
							break;
						}

					}
						//console.log(listitem[i]+':'+chalk.yellow(yangtree[listitem[i]]['id']));
						
					}
				}
				else if(String(data).charAt(0) != '{' && String(data).charAt(0) != '['){
					console.log(chalk.green(yangtree));
					console.log(chalk.red('You have reached a leaf of the yangtree'));
				}
				else{
					for( var i=0; i<listitem.length; i++){
						console.log(chalk.yellow(listitem[i]));
					}
				}
			}
			)

	});

	program
	.command('select <node>')
	.description('Choose a node')
	.action((node) => {
		fs.readFile('./yang.json',function(err,data){

			if(!data  ||  err){
				console.log(err);
				console.log('You must reconnect to Restconf\n');
			}

			var yangtree = JSON.parse(data);
			var listitem = Object.keys(yangtree);
			if(String(data).charAt(0) == '[') {
				if(!yangtree[parseInt(node)]){
					console.log(chalk.red('Invalid choice:'), chalk.yellow('Pick from the options provided by list operation'));
					return;
				}

				yangtree = yangtree[parseInt(node)];
				yangtree = JSON.stringify(yangtree);
				fs.writeFile('./yang.json', yangtree, function(error){
					if(error){
						console.log(error);
					}
					else{
						console.log(chalk.green('file written'));
					}
				});
			}
			else if(String(data).charAt(0) != '{' && String(data).charAt(0) != '[' ){
				console.log(chalk.red("Can't go beyond this, try reconnecting..."));
			}

			else {
				var flag = 0;
				for( var i = 0; i<listitem.length; i++){
					if(listitem[i] == node){
						flag = 1;
						yangtree = yangtree[listitem[i]];
						yangtree = JSON.stringify(yangtree);
						fs.writeFile('./yang.json', yangtree, function(error){
							if(error){
								console.log(error);
								return;
							}
							else{
								
								console.log(chalk.green('file written'));
								return;
							}
						});
					}
					
													//var sublist = Object.keys(yangtree[listitem[i]]);
													//for(var j = 0; j<sublist.length; j++ )
													//	{
													//		if(sublist[j] == node){
													//				console.log(sublist[j]);
													//				yangtree = yangtree[listitem[i]][sublist[j]];
										    		//				console.log(yangtree);
													//				yangtree = JSON.stringify(yangtree);
													//				fs.writeFile('./yang.json', yangtree, function(error){
													//					if(error){
													//						console.log(error);
													//									}
													//						else{
													//								console.log('file written');
													//							}
													//				});
													//	} 

												}
												if(flag == 0)
												{
													console.log(chalk.red('Invalid choice:'), chalk.yellow('Pick from the options provided by list operation'));
													}
					
											} 
											
											
										})
	});

	program.parse(process.argv);

