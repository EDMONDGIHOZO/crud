const express = require('express')
const app = express()
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

app.listen(3000, () => {
    {
        console.log('serve started on http://localhost:3000')
    }
})

/*** set the views engine */
app.set('view engine', 'ejs')
    /** configuration  */
app.use(express.urlencoded({ extended: false }))

/** routing */
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    const contents = {
        title: 'About us',
        items: ['one', 'number', 'in town'],
    }
    res.render('about', { model: contents })
})

app.get('/books', (req, res) => {
    const sql = 'SELECT * FROM Books ORDER BY Title'
    db.all(sql, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        res.render('books', { model: data })
    })
})

app.get('/edit/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM Books WHERE Book_ID = ?'
    db.get(sql, id, (err, rows) => {
        if (err) {
            console.log(err.message)
        }
        res.render('edit', { model: rows })
    })
})

app.post('/edit/:id', (req, res) => {
    const id = req.params.id
    const book = [req.body.Title, req.body.Author, req.body.Comments, id]
    const sql =
        'UPDATE Books SET Title = ? , Author = ?, Comments = ? WHERE (Book_ID = ?)'

    db.run(sql, book, (err) => {
        if (err) {
            console.log(err.message)
        }
        res.redirect('/books')
    })
})

app.get('/create', (req, res) => {
    res.render('create', { model: {} })
})

app.post('/create', (req, res) => {
    const sql = 'INSERT INTO Books (Title, Author, Comments) VALUES (? , ? , ?)'
    const book = [req.body.Title, req.body.Author, req.body.Comments]

    db.run(sql, book, (err) => {
        if (err) {
            console.log(err.message)
        }
        res.redirect('/books')
    })
})

app.get('/delete/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM Books WHERE Book_ID = ?'
    db.get(sql, id, (err, row) => {
        // if (err) ...
        res.render('delete', { model: row })
    })
})

app.post('/delete/:id', (req, res) => {
    const id = req.params.id
    const sql = 'DELETE FROM Books WHERE Book_ID = ?'
    db.run(sql, id, (err) => {
        // if (err) ...
        res.redirect('/books')
    })
})

/** allow public files */
app.use(express.static(path.join(__dirname, 'public')))

/** database connection to sqlite */
const db_name = path.join(__dirname, 'data', 'crud.db')

const db = new sqlite3.Database(db_name, (err) => {
        if (err) {
            return console.log(err.message)
        }
        console.log("subccessful connection to the database 'crud.db'")
    })
    /** database tables creation */

const sql_create = `CREATE TABLE IF NOT EXISTS Books (
  Book_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Title VARCHAR(100) NOT NULL,
  Author VARCHAR(100) NOT NULL,
  Comments TEXT
);`

db.run(sql_create, (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log("Successful creation of the 'Books' table")
})


const sql_insert = `INSERT INTO Books (Book_ID, Title, Author, Comments) VALUES
  (1, 'Mrs. Bridge', 'Evan S. Connell', 'First in the serie'),
  (2, 'Mr. Bridge', 'Evan S. Connell', 'Second in the serie'),
  (3, 'L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne');`
db.run(sql_insert, (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Successful creation of 3 books')
})