import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 8000;
import usersRouter from './src/routes/users.route.mjs';
import parkingRouter from './src/routes/parking.route.mjs';
import paymentRouter from './src/routes/payments.route.mjs';
import adminRouter from './src/routes/admin.route.mjs';

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb"
  })
);

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/users', usersRouter);
app.use('/parking', parkingRouter);
app.use('/payments', paymentRouter);
app.use('/admin', adminRouter);

// For imagekit uploads
// app.use('/upload/', uploadsRouter);

/* DB */
import db from "./src/models/index.mjs";
db.sequelize.sync({force: false}).then(() => console.log("Synced DB"));

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({success: false, 'message': err.message});
  
  return;
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://localhost:${port}`)
});
