const express=require('express');
const router =express.Router()
const db=require('../data/database');

router.get('/',function(req,res){
    res.redirect('posts');
    
});
router.get('/posts',async function(req,res){
    const query=`SELECT posts.*,authors.name AS a_name  
    FROM posts INNER JOIN authors ON posts.author_id=authors.id`;
    
    const [posted]= await db.query(query);
    res.render('posts-list',{pos:posted});
});
router.get('/new-post',async function(req,res){
    const [authors]=await db.query('SELECT * FROM authors');
    res.render('create-post',{authors:authors})
});
router.post('/posts', async function(req,res){
    req.body;
    const data=[req.body.title,req.body.summary,req.body.content,req.body.author];

   await db.query('INSERT INTO posts(title,summary,body,author_id) VALUES (?)',[data])
   res.redirect('/posts');
})
router.get('/posts/:i', async function(req,res){
    const query=`SELECT posts.* ,authors.name AS authors_name,authors.email AS author_email FROM posts 
    INNER JOIN authors ON posts.author_id=authors.id
    WHERE posts.id=?`
    const [posts]=await db.query(query,[req.params.i])
    if(!posts || posts.length===0){
       return res.status(404).render('404');
        
    }
    res.render('post-detail',{posts:posts[0]});
})

module.exports=router