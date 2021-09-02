const mongoose = require('mongoose');
const mongoPath = process.env.MONGOPATH;



module.exports = async () => {
    await mongoose.connect(mongoPath, {poolSize: 20, useNewUrlParser: true, useUnifiedTopology: true});
    return mongoose;
};

mongoose.set('useFindAndModify', false);