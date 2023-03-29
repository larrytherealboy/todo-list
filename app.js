// 載入 espress, 建構應用程式伺服器
const express = require('express')

// 載入相關套件
const exhbs = require('express-handlebars')
const bodyPaser = require('body-parser')
const methodOverride = require('method-override')


// 引用路由器
const routes = require('./routes')
// 引用mongoose連線設定
require('./config/mongoose')


const app = express()

// 設定樣版引擎
app.engine('hbs', exhbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


// 設定每一筆請求都會透過 bodyPaser, methodOverride 進行前置處理
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 將 request 導入路由器
app.use(routes)


// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})