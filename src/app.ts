import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { Request, Response } from 'express';

const app = express();
dotenv.config();
module.exports = app;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

function loggerMiddleware(request: Request, response: Response, next): void {
  if (request.method !== 'HEAD') {
    const date = new Date().toISOString();
    console.info(`${date} - ${request.method} ${request.path}`);
  }
  next();
};
app.use(loggerMiddleware);

import guest from './controllers/guest'

app.use('/', guest);
// app.use('/', admin);
// app.use('/', auth);

app.get('/');

app.all('*', (req, res) => {
  res.sendStatus(404)
});

const start = async () => {
  const port = process.env.PORT || 3000
  try {
    app.listen(port, () => {
      console.log('server running on port %d', port)
    })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

if (!module.parent) {
  start().catch(err => {
    console.log(err)
    process.exit(1)
  })
}