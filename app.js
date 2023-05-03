// 載入 espress, 建構應用程式伺服器
const express = require('express')

// 載入相關套件
const exhbs = require('express-handlebars')
const bodyPaser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 如果在 Heroku 環境則使用 process.env.PORT, 否則為本地環境，使用 3000 
const PORT = process.env.PORT || 3000

// 引用路由器
const routes = require('./routes')
// 引用mongoose連線設定
require('./config/mongoose')


const app = express()

// 設定樣版引擎
app.engine('hbs', exhbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 使用 app.use 代表這組 middleware 會作用於所有的路由

// 設定每一筆請求都會透過 bodyPaser, methodOverride 進行前置處理
app.use(flash())  
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)


// req.user 是在反序列化的時候，取出的 user 資訊，之後會放在 req.user 裡以供後續使用
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})

// 將 request 導入路由器
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})