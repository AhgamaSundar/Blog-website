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
    if (Number(req.body.password)===555){

   await db.query('INSERT INTO posts(title,summary,body,author_id) VALUES (?)',[data])
   res.redirect('/posts');}
   else{
    res.render('wrngpass.ejs');
   }
})
router.get('/posts/:i', async function(req,res){
    const query=`SELECT posts.* ,authors.name AS authors_name,authors.email AS author_email FROM posts 
    INNER JOIN authors ON posts.author_id=authors.id
    WHERE posts.id=?`
    const [posts]=await db.query(query,[req.params.i])
    if(!posts || posts.length===0){
       return res.status(404).render('404');
        
    }
    const postData={
        ...posts[0],
        date:posts[0].date.toISOString(),
        humanReadableDate:posts[0].date.toLocaleDateString('en-US',{
            weekday:"long",
            year:"numeric",
            month:"long",
            day:"numeric"
        })

    }
    res.render('post-detail',{posts:postData});
})
router.get('/update-epost/:id',async function(req,res){
    await db.query('DELETE FROM POSTS WHERE id=?',[req.params.id]);
    res.redirect('/posts');
    
})

module.exports=router