require('dotenv').config();
let express = require('express');
let classRouter = require('./routes/v1/class');

let app = express();
let port = process.env.PORT || 3000;

// middleware for parsing json content on requests
app.use(express.json());

// router for handling all the endpoints that start with /v1/class
app.use('/v1/class', classRouter);

app.use(function(err, req, res) {
    console.log('404, not found', err);
})

app.listen(port, () => {
    console.log(`Server listening at: ${port}`);
});