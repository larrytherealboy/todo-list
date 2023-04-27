// 載入 espress, 建構應用程式伺服器
const express = require('express')

// 載入相關套件
const exhbs = require('express-handlebars')
const bodyPaser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

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


// 設定每一筆請求都會透過 bodyPaser, methodOverride 進行前置處理
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

// 將 request 導入路由器
app.use(routes)


// 設定 port 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})