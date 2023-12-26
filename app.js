import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import authRoute from './prisma/routes/authRoute.js';
import blogRoute from './prisma/routes/blogRoute.js';
import activityRoute from './prisma/routes/activityRoute.js';
import financialRoute from './prisma/routes/financialRoute.js';
import timeRoute from './prisma/routes/timeRoute.js';
import dietRoute from './prisma/routes/dietRoute.js';
import { scheduleReminders } from './prisma/services/reminderEmail.js';

const app = express();
const port = 5000;

scheduleReminders();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/', authRoute);
app.use('/blog', blogRoute);
app.use('/activity', activityRoute);
app.use('/financialRecord', financialRoute);
app.use('/timeManagement', timeRoute);
app.use('/dietPlan', dietRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});