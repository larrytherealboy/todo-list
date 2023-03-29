// 載入 espress, 建構應用程式伺服器
const express = require('express')
const app = express()

// 載入相關套件
const exhbs = require('express-handlebars')
const mongoose = require('mongoose') // library mongoose
const bodyPaser = require('body-parser')
const methodOverride = require('method-override')


// 引用路由器
const routes = require('./routes')



// 僅在非正式環境時，使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 設定連線到mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


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