
'use strict'

var express = require('express'),
    bodyParser= require('body-parser'),
    url = require('url'),
    mysql=require('mysql'),
    app = express();	//express object instantiated

//Serve static files
//app.use(express.static('app'));


//Parse application/json
app.use(bodyParser.json())	//bodyParser has build in middlewares thata interpret urls, json, etc! 	//json is a key-value pairs, a 'hash' in curly braces!


var conn = mysql.createConnection({	//create connection to database ritevote on the cpanel host
		host: 'datapuffgirls.web.engr.illinois.edu',
		user: 'datapuff_manasa',
		password: 'database',
		database: 'datapuff_ritevote'
})

conn.connect(function(err) {
	if (err) {
		console.log("Error connecting to database");
		process.exit();
	}
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.use allows middlewares to be used (ie. get, post, add, etc are all middlewares. using use() allows u to use a different custom middleware)
//global to the web server part, kind of like an app
			//create route like request, response   
		/*app.use(function(rq, res, next))	
			try { 
				req.body= JSON.parse (req.body)}
			catch (e) {

			}
			next()	//goes to next middlware
		}
		app.use(function(...) {
			var start = new Data()
			next()
		})
	*/

//Perform queries using sql	


//Post route for inserting a politician to the database
app.post('/insertPoliticalRep', function(req, res) {
	console.log("is doing something")
	var body = req.body
	console.log('Body: ', body)
	//conn.connect();
	var stmt = "INSERT INTO PoliticalRepresentative (name, state, termBegin, termEnd, partyAffiliation, houseName) VALUES (?,?,?,?,?,?)";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = 
	[body.polname,		//CHANGE THE NAME OF THIS VAR!!!
	body.state,
	body.termBegin,
	body.termEnd,
	body.partyAffiliation,
	body.houseName
	]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not insert data to database"
			})
		}
		res.send({
			success:true
		})
	})
	//console.log('Body: ', req.body)
	//res.send(req.body)	//send info to server
})

//delete a politcical rep query
app.post('/deletePoliticalRep', function(req,res){
	var body = req.body
	console.log('Body: ', body)
	//conn.connect();
	var stmt = "DELETE FROM PoliticalRepresentative WHERE name = ? AND state = ?";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = 
	[body.polname, body.state
	]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		res.send({
			success:true
		})
	})
})



//search for a politcical rep entry
app.post('/searchPoliticalRepbyState', function(req,res){
	console.log("here in search")
	var body = req.body
	console.log('Body: ', body)
	var stmt = "SELECT * FROM PoliticalRepresentative WHERE state = ?";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = [ body.state ]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		console.log(result)
		var ret = JSON.stringify(result);
		res.send(ret);
			//{success:true
		//})
	})
})


//search for all bills sponsored by a legislator
app.post('/search/billByLegislator', function(req,res){

	var body = req.body
	console.log('Body: ', body)
	var stmt = "SELECT Legislation.title, Legislation.link, Legislation.topic FROM Legislation, sponsors WHERE sponsors.name = ? AND sponsors.title = Legislation.title";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = [ body.polname ]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		console.log(result)
		var ret = JSON.stringify(result);
		res.send(ret);
			//{success:true
		//})
	})
})

//search for all the committees served on by your state
app.post('/search/committeeByState', function(req,res){

	var body = req.body
	console.log('Body: ', body)
	var stmt = "SELECT DISTINCT committee.committeeName, committee.houseName FROM belongs, committee, PoliticalRepresentative WHERE PoliticalRepresentative.state = ? AND PoliticalRepresentative.name = belongs.name AND committee.committeeName = belongs.committeeName";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = [ body.state ]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		console.log(result)
		var ret = JSON.stringify(result);
		res.send(ret);
			//{success:true
		//})
	})
})

//search for a list of bills based on state
app.post('/search/billByState', function(req,res){

	var body = req.body
	console.log('Body: ', body)
	var stmt = "SELECT Legislation.title, Legislation.link, Legislation.topic FROM Legislation, sponsors WHERE sponsors.state = ? AND sponsors.title = Legislation.title";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = [ body.state ]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		console.log(result)
		var ret = JSON.stringify(result);
		res.send(ret);
			//{success:true
		//})
	})
})

//update query
app.post('/updatePoliticalRep', function(req, res) {
	var body = req.body
	console.log('Body: ', body)
	//conn.connect();
	var stmt = "UPDATE PoliticalRepresentative SET name = ?, state = ?, termBegin = ?, termEnd = ?, partyAffiliation = ?, houseName = ? WHERE name = ?";
	var inserts = 
	[body.polname,		
	body.state,
	body.termBegin,
	body.termEnd,
	body.partyAffiliation,
	body.houseName,
	body.polname
	]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not udpate data in database"
			})
		}
		res.send({
			success:true
		})
	})
})



//create basic express server
app.listen(3000, function () {
	console.log('Listening on localhost:3000/')
})




//user inputs up to 5 candidates to compare
//do calculations for candidate similarity analysis statistics
app.post('/candidateComparison', function(req, res) {
	var body = req.body
	console.log('Body: ', body)
	//conn.connect();

	//will contain how many bills were sponsored by each candidate in regards to each of these topics
	//these topics are used to consider similarity between candidates
	var numabortionsponsored = 0
	var numabortionsponsored2 = 0

	var numdeathpenalty = 0
	var numdeathpenalty2 = 0

	var numguncontrol = 0 
	var numguncontrol2 = 0 

	var nummarijuana = 0
	var nummarijuana2 = 0

	var numaffordablecare=0
	var numaffordablecare2=0

	
	//find number of bills sponsored by each legislator about abortion
	var stmt = "SELECT COUNT(*) AS numAbortions FROM sponsors,Legislation WHERE (sponsors.name = ? ) AND sponsors.title=Legislation.title AND Legislation.topic='Abortion'";
	var inserts = 
	[body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not query data in database for statistical analysis"
			})
		}
		numabortionsponsored = result[0].numAbortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numAbortions2 FROM sponsors,Legislation WHERE (sponsors.name = ?) AND sponsors.title=Legislation.title AND Legislation.topic='Abortion'";
	var inserts = 
	[body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numabortionsponsored2 = result[0].numAbortions2;
	})

	//find number of bills sponsored by each legislator about affordable care
	var stmt = "SELECT COUNT(*) AS numAbortions FROM sponsors,Legislation WHERE (sponsors.name = ? ) AND sponsors.title=Legislation.title AND Legislation.topic='Affordable Care'";
	var inserts = [body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numaffordablecare = result[0].numAbortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numAbortions2 FROM sponsors,Legislation WHERE (sponsors.name = ?) AND sponsors.title=Legislation.title AND Legislation.topic='Affordable Care'";
	var inserts = [body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numaffordablecare2 = result[0].numAbortions2;
	})

	//find number of bills sponsored by each legislator about gun control
	var stmt = "SELECT COUNT(*) AS numAbortions FROM sponsors,Legislation WHERE (sponsors.name = ? ) AND sponsors.title=Legislation.title AND Legislation.topic='Gun Control'";
	var inserts = [body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numguncontrol = result[0].numAbortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numAbortions2 FROM sponsors,Legislation WHERE (sponsors.name = ?) AND sponsors.title=Legislation.title AND Legislation.topic='Gun Control'";
	var inserts = [body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numguncontrol2 = result[0].numAbortions2;
	})

	//find number of bills sponsored by each legislator about Marijuana
	var stmt = "SELECT COUNT(*) AS numAbortions FROM sponsors,Legislation WHERE (sponsors.name = ? ) AND sponsors.title=Legislation.title AND Legislation.topic='Marijuana'";
	var inserts = [body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		nummarijuana = result[0].numAbortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numAbortions2 FROM sponsors,Legislation WHERE (sponsors.name = ?) AND sponsors.title=Legislation.title AND Legislation.topic='Marijuana'";
	var inserts = [body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		nummarijuana2 = result[0].numAbortions2;
	})

	//find number of bills sponsored by each legislator about death penalty
	var stmt = "SELECT COUNT(*) AS numAbortions FROM sponsors,Legislation WHERE (sponsors.name = ? ) AND sponsors.title=Legislation.title AND Legislation.topic='Death Penalty'";
	var inserts = [body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numdeathpenalty = result[0].numAbortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numAbortions2 FROM sponsors,Legislation WHERE (sponsors.name = ?) AND sponsors.title=Legislation.title AND Legislation.topic='Death Penalty'";
	var inserts = [body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numdeathpenalty2 = result[0].numAbortions2;
		//package data to return
		var returndata = {"numabort1": numabortionsponsored, "numabort2": numabortionsponsored2, "numaffcare1": numaffordablecare, "numaffcare2": numaffordablecare2, "nummarijuana1": nummarijuana, "nummarijuana2": nummarijuana2, "numgun1": numguncontrol, "numgun2": numguncontrol2, "numdeath1": numdeathpenalty, "numdeath2": numdeathpenalty2};
		res.send(returndata);
	})
}) 

app.post('/dataviz', function(req,res) {
	var numaff=0
	var numabort=0
	var numdeath =0
	var nummarijuana=0
	var numgun=0
	var totalaff=0
    var totalabort=0
    var totaldeath =0
    var totalmarijuana=0
    var totalgun=0  
    var numdemo = 0
    var numrepub =0
    var numindep=0

	//find number of bills for each topic that have been enacted
	var stmt = "SELECT COUNT(*) AS numAbortions FROM Legislation WHERE Legislation.topic='Abortion' AND Legislation.status='Enacted'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numabort = result[0].numAbortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numAbortions2 FROM Legislation WHERE Legislation.topic='Affordable Care' AND Legislation.status='Enacted'";
	var inserts = []
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numaff = result[0].numAbortions2;
	})
	var stmt = "SELECT COUNT(*) AS numAbortions FROM Legislation WHERE Legislation.topic='Death Penalty' AND Legislation.status='Enacted'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numdeath = result[0].numAbortions;
	})
	var stmt = "SELECT COUNT(*) AS numAbortions FROM Legislation WHERE Legislation.topic='Marijuana' AND Legislation.status='Enacted'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		nummarijuana = result[0].numAbortions;
	})
	var stmt = "SELECT COUNT(*) AS numAbortions FROM Legislation WHERE Legislation.topic='Gun Control' AND Legislation.status='Enacted'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numgun = result[0].numAbortions;
		//var returndata = {"numabort": numabort, "numaff": numaff, "numgun": numgun, "numdeath": numdeath, "nummarijuana": nummarijuana};
		//res.send(returndata);
	})

	//get TOTAL bills enacted
	var stmt = "SELECT COUNT(*) AS numAbortions FROM Legislation WHERE Legislation.topic='Abortion'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		totalabort = result[0].numAbortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numAbortions2 FROM Legislation WHERE Legislation.topic='Affordable Care'";
	var inserts = []
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		totalaff = result[0].numAbortions2;
	})
	var stmt = "SELECT COUNT(*) AS numAbortions FROM Legislation WHERE Legislation.topic='Death Penalty'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		totaldeath = result[0].numAbortions;
	})
	var stmt = "SELECT COUNT(*) AS numAbortions FROM Legislation WHERE Legislation.topic='Marijuana'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		totalmarijuana = result[0].numAbortions;
	})
	var stmt = "SELECT COUNT(*) AS numAbortions FROM Legislation WHERE Legislation.topic='Gun Control' ";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		totalgun = result[0].numAbortions;
	})

	//get political reps by party
	var stmt = "SELECT COUNT(*) AS numRepublican FROM PoliticalRepresentative WHERE PoliticalRepresentative.partyAffiliation='Republican'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numrepub = result[0].numRepublican;
	})
	var stmt2 = "SELECT COUNT(*) AS numAbortions FROM PoliticalRepresentative WHERE PoliticalRepresentative.partyAffiliation='Democrat'";
	var inserts = []
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numdemo = result[0].numAbortions;
	})
	var stmt = "SELECT COUNT(*) AS numAbortions FROM PoliticalRepresentative WHERE PoliticalRepresentative.partyAffiliation='Independent'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numindep = result[0].numAbortions;
		var returndata = {"numrepub":numrepub,"numdemo":numdemo,"numindep":numindep, "numabort": numabort, "numaff": numaff, "numgun": numgun, "numdeath": numdeath, "nummarijuana": nummarijuana, "totalabort": totalabort, "totalaff": totalaff, "totalgun": totalgun, "totalmarijuana":totalmarijuana,"totaldeath":totaldeath}
		res.send(returndata);
	})
})


//post for the quiz (still need to complete what we are doing with quiz information)
app.post('/quiz', function(req, res) {
	console.log("is doing something")
	var body = req.body
	console.log('Body: ', body)

	//code for what we are doing with the information
	//console.log('Body: ', req.body)
	//res.send(req.body)	//send info to server
})
