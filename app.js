// library espress, 建構應用程式伺服器
const express = require('express')
const app = express()
const exhbs = require('express-handlebars')

const mongoose = require('mongoose') // library mongoose


app.engine('hbs', exhbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// 僅在非正式環境時，使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 設定連線到mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})

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

// 設定首頁路由
app.get('/', (req, res) => {
  res.render('index')
})

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})