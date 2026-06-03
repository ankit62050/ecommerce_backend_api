import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './db/index.js';

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Database connection established successfully.");
    });

    app.on('error', (error) => {
        console.error("error connecting the server:", error);
    });
})
.catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the application if the database connection fails
});




// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });