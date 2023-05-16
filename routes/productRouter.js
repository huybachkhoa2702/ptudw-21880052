let express = require('express');
let router = express.Router();
router.get('/', (req, res) => {
    if (req.query.category == null || isNaN(req.query.category)) {
        req.query.category = 0;
    }
    if (req.query.brand == null || isNaN(req.query.brand)) {
        req.query.brand = 0;
    }
    if (req.query.color == null || isNaN(req.query.color)) {
        req.query.color = 0;
    }
    if (req.query.min == null || isNaN(req.query.min)) {
        req.query.min = 0;
    }
    if (req.query.max == null || isNaN(req.query.max)) {
        req.query.max = 200;
    }
    if (req.query.sort == null) {
        req.query.sort = 'name';
    }
    if (req.query.limit == null || isNaN(req.query.limit)) {
        req.query.limit = 9;
    }
    if (req.query.page == null || isNaN(req.query.page)) {
        req.query.page = 1;
    }
    if (req.query.search == null || req.query.search.trim() == '') {
        req.query.search = '';
    }
    let categoryController = require('../controllers/categoryController');
    categoryController
        .getAll(req.query)
        .then(data => {
            res.locals.categories = data;
            console.log(JSON.stringify(data));
            let brandController = require('../controllers/brandController');
            return brandController.getAll(req.query);
        })
        .then(data => {
            res.locals.brands = data;

            let colorController = require('../controllers/colorController');
            return colorController.getAll(req.query);
        })
        .then(data => {
            res.locals.colors = data;
            let productController = require('../controllers/productController');
            return productController.getAll(req.query);
        })
        .then(data => {
            res.locals.products = data.rows;
            res.locals.pagination = {
                page: parseInt(req.query.page),
                limit: parseInt(req.query.limit),
                totalRows: data.count
            }
            let productController = require('../controllers/productController');
            return productController.getTopProducts();
        })
        .then(data => {
            let newdata = [];
            let temp = [];
            for (let i = 1; i <= data.length; i++) {
                temp.push(data[i - 1]);
                if (i % 3 == 0) {
                    newdata.push(temp);
                    temp = [];
                }
            };
            res.locals.topProducts = newdata;
            res.render('category');
        })
        .catch(err => next(err));
});
router.get('/:id', (req, res) => {
    let productController = require('../controllers/productController');
    productController
        .getById(req.params.id)
        .then(product => {
            res.locals.product = product;
            let reviewController = require('../controllers/reviewController');
            return reviewController.getUserReviewProduct(1, req.params.id);
        })
        .then(review => {
            res.locals.userReview = review;
            res.render('single-product');
        })
        .catch(err => next(err));

});
module.exports = router;