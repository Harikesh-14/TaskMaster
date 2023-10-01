const express = require('express');
const path = require('path')
const passport = require('passport')
const flash = require('connect-flash');
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
    saveUninitialized: false,
}))

app.use(flash());

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

app.post('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout();
        console.log('User logged out');
    }
    passport.authenticate("local", {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});

// sign in page routes
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "signIn.html"))
})

app.post('/signin', async (req, res) => {
    try {
        const profileList = new loginDetails({
            firstName: req.body.signUpFirstName,
            lastName: req.body.signUpLastName,
            emailID: req.body.signUpEmailID,
            password: req.body.signUpPassword,
        })

        await profileList.save()
        res.redirect('/')
    } catch (err) {
        console.log("An error occurred")
        res.status(500).json({
            error: "Error while registering the detail",
            errorMessage: err
        })
    }
})

app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

app.listen(port, () => {
    console.log(`Your server is running at: http://localhost:${port}`);
});
