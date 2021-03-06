const express = require('express');
const mongoskin = require('mongoskin');
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');
const app = express();

app.use(bodyParser.json());
app.use(logger());
app.set('port',process.env.PORT || 3000);

const db = mongoskin.db('mongodb://love1024:Lsvwsan9@ds237868.mlab.com:37868/abc');
const id = mongoskin.helper.toObjectID

const collection = db.collection('abc');
const tileCollection = db.collection('tile');

app.param('id', (req, res, next, id) => {
  req.id = id;
  return next()
})

app.get('/',(req,res,next) => {
	console.log("simple");
	collection.find({},{limit:10, sort: [['_id',-1]]})
		.toArray((err,results) => {
			if(err) 
				return next(err);
			res.send(results);
		}
	);
});

app.get('/tiles',(req,res,next) => {
	console.log('tiles');
	tileCollection.find({},{limit:10, sort: [['_id',-1]]})
		.toArray((err,results) => {
			if(err) 
				return next(err);
			res.send(results);
		}
	);
});

app.get('/:id',(req,res,next) => {
	console.log("id");
	collection.find({_id:id(req.id)})
		.toArray((err,results) => {
			if(err) 
				return next(err);
			res.send(results);
		}
	);
});



//To store whole blog 
app.post('/',(req,res,next) => {
	collection.insert(req.body,{},(err,results) => {
		if(err)
			return next(err);
		res.send(results.ops);
	})
});

//To store tile of general information about blogs
app.post('/tile',(req,res,next) => {
	console.log("In tile post");
	tileCollection.insert(req.body,{},(err,results) => {
		if(err)
			return next(err);
		res.send(results.ops);
	})
})

const server = http.createServer(app);
const boot = () => {
	server.listen(app.get('port'), () => {
	console.info(`Express server listening 
	  on port ${app.get('port')}`)
	})
}

const shutdown = () => {
	server.close(process.exit);
}

if(require.main == module) {
	boot();
} else {
	console.info('Running app as a module')
	exports.boot = boot
	exports.shutdown = shutdown
	exports.port = app.get('port')
}










