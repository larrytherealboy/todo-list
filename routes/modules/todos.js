// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')


// 取得新增todos表單
router.get('/new', (req, res) => {
  return res.render('new')
})


// 新增toods
router.post('/', (req, res) => {
  const todos = String(req.body.name).split(',').map(todo => ({ name: todo }))
  return Todo.insertMany(todos) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})


// 瀏覽特定todo
router.get('/:id', (req, res) => {
  const id = req.params.id
  Todo.findById(id)
    .lean() // 撈資料想用 res.render()，就要先用 .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})


// 取得編輯todo表單
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Todo.findById(id)
    .lean() // 撈資料想用 res.render()，就要先用 .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})


// 修改todo
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body

  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})


// 刪除todo
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// 匯出路由模組
module.exports = router