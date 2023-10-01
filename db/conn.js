const mongoose = require('mongoose');
const DB_URI = process.env.DB_URI

mongoose.set('strictQuery', false);

mongoose.connect(`${DB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.error("Error connecting to the database:", err);
});
