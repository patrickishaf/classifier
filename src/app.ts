import express from 'express';
import cors from 'cors';
import controller from './controller';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/profiles', controller.classify);

export default app;