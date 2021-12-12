let mongoose = require('mongoose');

(async function() {
    try {
        await mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`);
    }
    catch(err) {
        console.log(err);
    }
})();

module.exports = mongoose;