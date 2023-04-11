/*
	node.js (https://nodejs.org/)
*/
const env=require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const un=process.env.un;
const pw=process.env.pw;
const uri = `mongodb+srv://${un}:${pw}@cluster0.nwpxtlg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const database = client.db("theHub");
const people = database.collection("people");
const socialEvents = database.collection("socialEvents");
const roles = database.collection("roles");
const permissions = database.collection("permissions");
const http=require('http');
const port=8081;
let reqNumber=0;

const server=http.createServer();

server.on('request',(request,response) => { //requests must be delivered via POST method
	response.setHeader("Access-Control-Allow-Origin", "*"); //CORS system needs this
	let data;
	let chunks = [];
	request.on('data',(chunk)=>{//chunks of data recieved through the http stream are added to an array
		chunks.push(chunk);
	}).on('end',async ()=>{ //process data array from the http header after the http request stream has ended
		data=JSON.parse(Buffer.concat(chunks).toString());
		reqNumber++;
		console.log(reqNumber,data); //see request data from the http POST header
		const tResponse=new Object;
		response.writeHead(200,{'Content-Type':'text/plain'});
		console.log("data",data);
		if(data.ca){
			let result = people.updateOne(
				{email: data.em},
				{"$setOnInsert": {email: data.em,uname: data.un, pword: data.pw, fname: data.fn, lname: data.ln}},
				{upsert: true}
			).then(r=>{
				response.write(JSON.stringify(r),"utf8");
				response.end();
			});
		}
		else if(data.pf) {
		}
		else if(data.ln) {
			let result = people.findOne(
				{"uname": data.un},
				{"uname":1,"pword":1,"fname":1,"lname":1,"email":1}
			).then(r=>{
				console.log("r",r);
				if(data.pw == r.pword) {
					delete r["pword"];
					response.write(JSON.stringify(r),"utf8");
					response.end();
				}
				else {

				}
			})
		}
		else{
			//console.log(tResponse); //see response just before being sent
			response.write(JSON.stringify(tResponse),"utf8");
			response.end();
		}
	});
});

server.listen(port,()=>{console.log("Waiting for http requests on port "+port)}); //start listening for http connections



