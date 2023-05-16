let express = require('express');
let app = express();

//set public static folder: set index file
app.use(express.static(__dirname + '/public'));

//use view engine: express-handlebars
let expressHbs = require('express-handlebars');
let helper = require('./controllers/helper');
let paginateHelper = require('express-handlebars-paginate');
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        createStarList: helper.createStarList,
        createStars: helper.createStars,
        createPagination: paginateHelper.createPagination
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//body parser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//use cookie parser
let cookieParser = require('cookie-parser');
app.use(cookieParser());

//use session
let session = require('express-session');
app.use(session({
    cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false
}));

//use cart controller
let Cart = require('./controllers/cartController');
app.use((req, res, next) => {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    req.session.cart = cart;
    res.locals.totalQuantity = cart.totalQuantity;
    //session user
    res.locals.fullname = req.session.user ? req.session.user.fullname : '';
    res.locals.isLoggedIn = req.session.user ? true : false;

    next();
})
//define your routes here
// / => index
// /products => category
// /products/:id => single + product
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));
app.use('/cart', require('./routes/cartRouter'));
app.use('/comments', require('./routes/commentRouter'));
app.use('/reviews', require('./routes/reviewRouter'));
app.use('/users', require('./routes/userRouter'));


app.get('/sync', (req, res) => {
    let models = require('./models');
    models.sequelize.sync()
        .then(() => { res.send('database sync complete!') });
});
app.get('/:page', (req, res) => {
    let page = req.params.page;
    res.render(page);
});

//set sever port and start server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});