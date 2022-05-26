//
var util = require('util');
var encoder = new util.TextEncoder('utf-8');

var path = require('path');

var express = require('express');
var app = express();
bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const cookieParser = require('cookie-parser');
app.use(cookieParser());
// app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));

// var db = require('../junk/db.js')
// // var dbC = require('./dbConnect.js')

// app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

//************ DB connection 
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://testuser:S4Cjm7a0z0qqSKG1@cluster0.osgsx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var conn = null
var dbName = "mydb"
var coll = "customers"

function connectToDbServer() {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        conn = db

    });
}
connectToDbServer();
//******** *
app.get('/', (req,res) =>{res.send('good')})

app.post('/login', handleLogin)
app.post('/logout', handleLogout)
app.post('/isLoggedIn', handleIsLoggedIn)
app.post('/crud', handleAuthAndCrud)
app.post('/getStats', handleAuthAndGetStats)


// app.get('/test', function(req, res){
//     console.log('testg et')
//     console.log(req.body)
//     res.cookie('asdf','asdfdsfs')
//     res.send()
// })
// app.post('/test', function (req, res) {
//     console.log(req.body)
//     console.log(req.cookies)
//     // res.cookie('asdf','asdff')
//     res.cookie('cookieName', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
//     res.send('mani')

// })



function handleCrud(params, res) {
    var operation = params.op
    var data = params.data

    console.log('data')
    console.log(data)
    console.log('data')

    jsonData = (data)

    console.log('jsonData')
    console.log(jsonData)



    collName = 'movies'
    var dbo = conn.db(dbName);

    if (operation == 'insert') {
        dbo.collection(collName).insert(jsonData, function (err, result) {
            if (err) res.send({'result':'fail'})
            else {
                res.send({'result':'suc'})
                console.log(result)
            }
        })
    }

    if (operation == 'delete') {
        dbo.collection(collName).deleteOne(jsonData, function (err, result) {
            if (err) res.send({'result':'fail'})
            else {
                res.send({'result':'suc'})
                console.log(result)
            }
        })
    }

    if (operation == 'update') {
        newData = (params.newData)
        console.log(jsonData, newData)
        dbo.collection(collName).updateOne(jsonData, { $set: newData }, function (err, result) {
            if (err) {
                res.send({'result':'fail'})
                console.log(err)
            }
            else {
                res.send({'result':'suc'})
                console.log(result)
            }
        })
    }

    if (operation == 'find') {
        // newData = JSON.parse(params.newData)
        dbo.collection(collName).find(jsonData).toArray( function (err, result) {
            if (err) {
                res.send({'result':'fail'})
                console.log(err)
            }
            else {
                res.send(result)
                console.log(result)
            }
        })
    }


}


function handleGetStats(params, res) {
    var operation = params.op
    var data = params.data




    collName = 'stats'
    var dbo = conn.db(dbName);

    // if (operation == 'find') {
        // newData = JSON.parse(params.newData)
        dbo.collection(collName).find(data).toArray( function (err, result) {
            if (err) {
                res.send({'result':'fail'})
                console.log(err)
            }
            else {
                res.send(result)
                console.log(result)
            }
        })
    // }


}

function handleAuthAndCrud(req, res) {
    var sessionId = req.cookies['sessId']
    var body = req.body

    var dbo = conn.db(dbName);
    dbo.collection('sessions').find({ sessId: sessionId }).toArray(function (err, result) {
        console.log(result)
        if (result.length) {

            console.log(req.body)
            handleCrud(req.body, res)
            // res.send({'result':'suc'})
        }
        else {
            res.send('not auth')
        }

    })


}

function handleAuthAndGetStats(req, res) {
    var sessionId = req.cookies['sessId']
    var body = req.body

    var dbo = conn.db(dbName);
    dbo.collection('sessions').find({ sessId: sessionId }).toArray(function (err, result) {
        console.log(result)
        if (result.length) {

            console.log(req.body)
            handleGetStats(req.body, res)
            // res.send({'result':'suc'})
        }
        else {
            res.send('not auth')
        }

    })


}





function handleIsLoggedIn(req, res) {
    var sessionId = req.cookies['sessId']
    console.log(req.cookies)
    var dbo = conn.db(dbName);
    dbo.collection('sessions').find({ sessId: sessionId }).toArray(function (err, result) {
        console.log(result)
        if (result.length) {
            res.send({'result':'suc'})
        }
        else {
            res.send({'result':'fail'})
        }

    })
}

function handleLogout(req, res) {
    var sessId = req.cookies['sessId']
    console.log(sessId)
    if (sessId) {
        var dbo = conn.db(dbName);
        // use deleteAll if needed 
        dbo.collection('sessions').deleteOne({ sessId: sessId }, function (err, res) {

        })

    }
    res.send({'result':'suc'})
}

function handleLogin(req, res) {
    //verify creds
    console.log(req.body)

    // if (!(req.body.uname || req.body.pwd)){
    //     console.log('in')
    //     res.send({'result':'fail'})
    // }

    var dbo = conn.db(dbName);
    
    dbo.collection(coll).find({ uname: req.body.uname, pwd: req.body.pwd }).toArray(function (err, result) {
        if (err) {
            res.send('err')
        }
        if (result.length) {// need better check, for empty str it allows, needs fix 
            console.log(result)
            //set cookie
            var dbo = conn.db(dbName);
            var newSessId = Math.random().toString()
            dbo.collection('sessions').insertOne({ sessId: newSessId })
            res.cookie('sessId', newSessId, { sameSite: 'none', secure:true})

            res.send({'result':'suc'})
        }
        else {
            res.send({'result':'fail'})
        }
    });
    // res.send(req.body)


}







// *(*****************) SERVER



// var server = app.listen(80, displayServerDetails)

// function displayServerDetails() {
//     var host = server.address().address
//     var port = server.address().port

//     console.log("Example app listening at http://%s:%s", host, port)
// }


//------------

var http = require('http')
var https = require('https')
var fs = require('fs')

var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.cert', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);


