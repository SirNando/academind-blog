const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/posts');
});

router.get('/posts', async function(req, res) {
    const [posts] = await db.query("SELECT posts.id, title, summary, date, name FROM blog.posts INNER JOIN blog.authors ON author_id = authors.id");
    res.render('posts-list', {posts: posts});
});

router.get('/new-post', async function(req, res) {
    const [authors] = await db.query('SELECT * FROM authors');
    res.render('create-post', {authors: authors})
});

router.post('/posts', async function(req, res) {
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author,
    ];
    await db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)', [data]);
    res.redirect('/posts');
})

router.get("/posts/:id", async function(req, res,) {
    const review_id = req.params.id;
    const query =   `SELECT posts.id, title, body, date, authors.name AS author_name FROM blog.posts
                    INNER JOIN blog.authors ON author_id = authors.id
                    WHERE posts.id = ` + review_id;
    const [post_info_array] = await db.query(query);
    const [post_info] = post_info_array;
    res.render('post-detail', {post: post_info});
})

router.get("/update-post/:id", async function(req, res) {
    const review_id = req.params.id;
    const query =   `SELECT posts.id, title, summary, body, date, authors.name AS author_name FROM blog.posts
                    INNER JOIN blog.authors ON author_id = authors.id
                    WHERE posts.id = ` + review_id;
    const [post_info_array] = await db.query(query);
    const [post_info] = post_info_array;
    res.render('update-post', {post: post_info})
})

router.post('/update-post/:id', async function(req, res) {
    const post_data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.params.id
    ];
    const query =   'UPDATE posts SET title = ?, summary = ?, body = ? WHERE id = ?'
    await db.query(query, [post_data[0], post_data[1], post_data[2], post_data[3]]);
    res.redirect('/posts');
})

router.post('/posts/:id/delete', async function(req, res) {
    const id = req.params.id;
    const query = 'DELETE FROM posts WHERE posts.id = ?';
    await db.query(query, [req.params.id]);
    res.redirect('/posts');
})

module.exports = router;