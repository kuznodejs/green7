const express = require('express'),
    router = express.Router(),
	{ ObjectId } = require('mongodb')
const { Connection } = require('../ext/Connection'),
	conf = require('../config/index')

const collection = 'users'

Connection.connectToMongo();

router.route('/').get(async (req, res) => {

	let content = []

	try {
		content = await Connection.db.collection(collection).find({}).toArray();
	}catch(err){
		throw err
	}

	res.render('pages/users', { title:'Users', siteName: conf.siteName, content})
})

router.route('/:id').get(async (req, res) => {
	const id = req.params.id
	let content = {
		firstName: '',
		lastName:'',
		email:'',
		phone:'',
		_id: id
	}

	if(id !== 'create'){
		try{
			content = await Connection.db.collection(collection).findOne({_id:ObjectId(id)})
		}catch(err){
			throw err
		}
	}

	res.render('pages/user', { title:'User',
		siteName:conf.siteName,
		content
	})
})
	.post((req, res) => {

		Connection.db.collection(collection).insertOne(req.body, (err, result) => {
			if(err){
				throw err;
			}
			res.redirect('/user')
		})

}).put((req, res) => {

	const id = req.params.id;

	Connection.db.collection(collection).findOneAndReplace({_id:ObjectId(id)},req.body, (err, result) => {
		if(err){
			throw err;
		}
		res.json({message: 'updated'})
	})

}).delete((req, res) => {
	const id = req.params.id;

	Connection.db.collection(collection).deleteOne({_id:ObjectId(id)}, (err, result) => {
		if(err){
			throw err;
		}
		res.json({message: 'deleted'})
	})
})

module.exports = router