import express from 'express';
import cors from 'cors';
import controller from './controller';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/profiles', controller.classify);
app.get('/api/profiles', controller.getAllProfiles);
app.get('/api/profiles/search', controller.searchProfiles);
app.get('/api/profiles/:id', controller.getSingleProfile);
app.delete('/api/profiles/:id', controller.deleteProfile);

export default app;