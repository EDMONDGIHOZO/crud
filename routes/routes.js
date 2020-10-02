module.exports = function(app) {
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
            res.json(data)
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
}