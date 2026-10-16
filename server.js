import express from 'express';
import router from './routes/kolcsonzesek.js';
import routerKonyvek from './routes/konyvek.js';
import routerOlvasok from './routes/olvaso.js';

const app = express();
const port = 3000;
app.use(express.json());

app.use('/kolcsonzesek', router);
app.use('/konyvek', routerKonyvek);
app.use('/olvasok', routerOlvasok);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});