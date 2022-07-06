// để chạy server
import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebEngine from './route/web.js';
import 'dotenv/config';

let app = express();
//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port = process.env.PORT || 6969;
//  PORT === undefined => 6969
app.listen(port, () => {
  console.log('Backend Nodejs is running on the port: ' + port);
});

viewEngine(app);
initWebEngine(app);
