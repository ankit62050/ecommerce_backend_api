import express from 'express';

const app = express();

app.use(express.json({ limit: "10mb" } ));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static("public"));


import userRoutes from './routes/user.route.js';
console.log("APP.JS LOADED");
app.use(express.json());
app.use('/api/v1/users', userRoutes);
export default app;