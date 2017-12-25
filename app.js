//import libraries
var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');

//create neccessary objects
var app = express();
var router = express.Router();

//you need to update wp with your own database name
var db = monk('localhost:27017/uni');


//use objects in app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(function(req,res,next){
//      req.db = db;
//      next();
//});

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		req.db = db;
		next();
	}
}
);

//CLIENT SIDE ROUTING
app.set('views', __dirname + '/views');

app.get('/home', function (req, res) {
	res.render('home.ejs');

});



//SERVER SIDE ROUTING
app.use('/', router);

router.get('/students', function (req, res) {
	req.db.collection('students').find({}, { "limit": 100 }, function (e, docs) {
		res.json(docs);
	});
});

router.get('/students/:id', function (req, res) {
	req.db.collection('students').findById(req.params.id, function (e, doc) {
		res.json(doc);
	})
});

router.put('/students/:id', function (req, res) {
	req.db.collection('students').update({ _id: req.params.id }, { name: req.body.name, yob: req.body.yob });
	req.db.collection('students').findById(req.params.id, function (e, doc) {
		res.json(doc);
	})

});

router.delete('/students/:id', function (req, res) {
	req.db.collection('students').remove({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})
});

router.post('/students', function (req, res) {

	console.log(req.body);
	req.db.collection('students').insert(req.body, function (e, docs) {
		res.json(docs);
	});
});

// Products
router.get('/products', function (req, res) {
	req.db.collection('products').find({}, { "limit": 100 }, function (e, docs) {
		res.json(docs);
	});
});

router.get('/products/:id', function (req, res) {
	req.db.collection('products').find({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})
});

router.get('/products/byType/:id', function (req, res) {
	req.db.collection('products').find({ productType: req.params.id }, { "limit": 100 }, function (e, doc) {
		res.json(doc);
	})
});

router.put('/products/:id', function (req, res) {
	req.db.collection('products').update(
		{ _id: req.params.id },
		{
			id: req.body.id,
			name: req.body.name,
			price: req.body.price,
			description: req.body.description,
			brand: req.body.brand,
			producer: req.body.producer,
			productType: req.body.productType,
			imageUrl: req.body.imageUrl
		}
	);
	req.db.collection('products').find({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})

});

router.delete('/products/:id', function (req, res) {
	req.db.collection('products').remove({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})
});

router.post('/products', function (req, res) {
	req.db.collection('products').insert(req.body, function (e, docs) {
		res.json(docs);
	});
});

// ProductTypes
router.get('/productTypes', function (req, res) {
	req.db.collection('productTypes').find({}, { "limit": 100 }, function (e, docs) {
		res.json(docs);
	});
});

router.get('/productTypes/:id', function (req, res) {
	req.db.collection('productTypes').find({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})
});

router.put('/productTypes/:id', function (req, res) {
	req.db.collection('productTypes').update(
		{ _id: req.params.id },
		{
			name: req.body.name,
			id: req.body.id
		}
	);
	req.db.collection('productTypes').find({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})

});

router.delete('/productTypes/:id', function (req, res) {
	req.db.collection('productTypes').remove({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})
});

router.post('/productTypes', function (req, res) {
	req.db.collection('productTypes').insert(req.body, function (e, docs) {
		res.json(docs);
	});
});

// ShoppingCarts
router.get('/shoppingCarts', function (req, res) {
	req.db.collection('shoppingCarts').find({}, { "limit": 100 }, function (e, docs) {
		res.json(docs);
	});
});

router.get('/shoppingCarts/:id', function (req, res) {
	req.db.collection('shoppingCarts').find({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})
});

router.put('/shoppingCarts/:id', function (req, res) {
	req.db.collection('shoppingCarts').update(
		{ _id: req.params.id },
		{
			customer: req.body.customer,
			products: req.body.products,
			status: req.body.status,
			date: req.body.date,
			total: req.body.total
		}
	);
	req.db.collection('shoppingCarts').find({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})

});

router.delete('/shoppingCarts/:id', function (req, res) {
	req.db.collection('shoppingCarts').remove({ _id: req.params.id }, function (e, doc) {
		res.json(doc);
	})
});

router.post('/shoppingCarts', function (req, res) {
	req.db.collection('shoppingCarts').insert(req.body, function (e, docs) {
		res.json(docs);
	});
});

// User
router.get('/user', function (req, res) {
	req.db.collection('user').find({}, { "limit": 1 }, function (e, docs) {
		res.json(docs);
	});
});

module.exports = app;
app.listen(8080);