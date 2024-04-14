// db.js
import mongoose from 'mongoose';


const connectDB = async () => {

    // console.log(process.env.MONGO_URL)

    try {
        const connect = await mongoose.connect(process.env.MONGO_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('MongoDB connected...', connect.connection.host);
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
