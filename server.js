
import Express from 'express';
import path from 'path';

// config
const APP_PORT = (process.env.PORT || 3000);
const app = new Express();
app.use(Express.static(__dirname));

app.get('/', (req,res) => {
  res.sendFile(path.resolve(__dirname,'src/www/index.html'));
});

app.get('/bundle.js', (req,res) => {
  res.sendFile(path.resolve(__dirname,'build/bundle.js'));
});
app.listen(APP_PORT, () => {
  console.log(`app listening on port  ${APP_PORT}`);
});
