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
    saveUninitialized: false,
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
    res.send('Hello World');
});

// sign in page routes
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "signIn.html"))
})
// sign up page routes
app.get('/signup', (req, res) => {
    res.send("SignUp Page")
})

app.listen(port, () => {
    console.log(`Your server is running at: http://localhost:${port}`);
});
