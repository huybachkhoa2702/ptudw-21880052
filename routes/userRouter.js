let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');


router.get('/login', (req, res) => {
    req.session.returnURL = req.query.returnURL;
    res.render('login');
});
router.post('/login', (req, res, next) => {
    let email = req.body.username;
    let password = req.body.password;
    userController.getUserByEmail(email)
        .then(user => {
            if (user) {
                if (userController.comparePassword(password, user.password)) {
                    req.session.user = user;
                    if (req.session.returnURL) {
                        res.redirect(req.session.returnURL);
                    } else { res.redirect('/'); }
                } else {
                    res.render('login', {
                        message: 'Email does no exists!',
                        type: 'alert-danger'
                    })
                }
            } else {
                res.render('login', {
                    message: 'Email does no exists!',
                    type: 'alert-danger'
                })
            }
        });
});
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', (req, res, next) => {
    let fullname = req.body.fullname;
    let email = req.body.email;
    let password = req.body.password

    let confirmPassword = req.body.confirmPassword;
    let keepLoggedIn = (req.body.keepLoggedIn != undefined);
    //kiem ra confirm password
    if (password != confirmPassword) {
        return res.render('register', {
            message: 'Confirm password does not match!',
            type: 'alert-danger'
        })
    }
    //kiem tra user name ton tai

    userController.getUserByEmail(email)
        .then(user => {
            if (user)
                return res.render('register', {
                    message: `Email ${email} exists!`,
                    type: 'alert-danger'
                });
            //tao tk moi

            user = {
                fullname,
                username: email,
                password
            }
            return userController
                .createUser(user)
                .then(user => {
                    if (keepLoggedIn) {
                        req.session.user = user;
                        res.render('/');
                    } else {
                        res.render('login', {
                            message: 'You have registered, now please login!',
                            type: 'alert-primary'
                        });
                    }
                })
        })
        .catch(err => next(err));
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return next(err);
        return res.redirect('login');
    });
});

module.exports = router;