const express = require('express');
const path = require('path')
const passport = require('passport')
const expressSession = require('express-session')
require('dotenv').config()

// establishing port
const port = process.env.PORT;
const app = express();

// files of the database
require('./db/conn')
const loginDetails = require('./db/loginDetails')
const { initializePassport, isAuthenticated } = require('./passportConfig');

// setting up express session
app.use(expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))

// setting up passport 
initializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// setting up the public folder
app.use(express.static(path.join(__dirname, 'public')))

// setting up the views folder
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// homepage route
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('profile')
    } else {
        res.redirect('/signin')
    }
})

// app.post('/', (req, res, next) => {
//     if (req.isAuthenticated()) {
//         req.logout();
//         console.log('User logged out');
//     }
//     passport.authenticate("local", {
//         successRedirect: '/profile',
//         failureRedirect: '/',
//         failureFlash: true
//     })(req, res, next);
// });

// sign in page routes
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "signIn.html"))
})

app.post('/signin', async (req, res) => {
    try {
        const { signUpFirstName, signUpLastName, signUpEmailID, signUpPassword } = req.body;

        if (signUpFirstName && signUpLastName && signUpEmailID && signUpPassword) {
            // This is a signup request
            const profileList = new loginDetails({
                firstName: signUpFirstName,
                lastName: signUpLastName,
                emailID: signUpEmailID,
                password: signUpPassword,
            });

            await profileList.save();
            console.log("User registered successfully");
        } else {
            // This is a login request
            passport.authenticate("local", {
                successRedirect: '/profile',
                failureRedirect: '/',
                failureFlash: true
            })(req, res);
            return; // Do not proceed to redirect below in case of login
        }

        res.redirect('/');
    } catch (err) {
        console.error("An error occurred", err);
        res.status(500).json({
            error: "Error while registering or logging in",
            errorMessage: err
        });
    }
});

app.get('/profile', isAuthenticated, (req, res) => {
    const { firstName } = req.user
    res.render('profile', { firstName });
});

// logout route
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Your server is running at: http://localhost:${port}`);
});
