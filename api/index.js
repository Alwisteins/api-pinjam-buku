import express from 'express';
import booksRouter from '../src/routes/bookRoutes.js';

const app = express();

//router
app.use('/api/v1/books', booksRouter)

export default app;