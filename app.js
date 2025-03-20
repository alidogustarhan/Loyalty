//Kütüphaneler
const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const app = express()
const path = require('path')

//Database işlemleri
const connectDB = require('./db/connect')

//Yardımcı Metodlar
const handlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const { initRoutes } = require('./routes/index')

//Client Routeları
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'html', 'login.html'));
});

app.get('/customer', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'html', 'category.html'));
});


//Güvenlik paketleri
app.use(cors())
app.use(compression())
app.use(helmet())
app.use(cookieParser())
app.disable('x-powered-by')

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Bir IP'den günde 2000 istek
  message: 'Çok fazla istek yaptınız. Lütfen daha sonra tekrar deneyin.'
});


app.use(limiter);

initRoutes(app)
app.use(notFound)
app.use(handlerMiddleware)

connectDB()

//Server işlemleri
app.listen(process.env.PORT, () => {
  console.log(`Sunucu ${process.env.PORT} portunda dinleniyor`);
})

