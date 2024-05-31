import express from 'express';
import booksRouter from '../src/routes/bookRoutes.js';
import membersRouter from '../src/routes/memberRoutes.js'

const app = express();

//middleware
app.use(express.json())

//router
app.use('/api/v1/books', booksRouter)
app.use('/api/v1/members', membersRouter)

export default app;