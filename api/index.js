import express from 'express';
import booksRouter from '../src/routes/bookRoutes.js';

const app = express();

//middleware
app.use(express.json())

//router
app.use('/api/v1/books', booksRouter)

export default app;