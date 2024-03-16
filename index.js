const PORT = 5432;
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import sql from './db';

// const { createClient } = require('@supabase/supabase-js');
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors()); // to get rid of the cross policy error
app.use(express.json()); // to be able to pass json 

// get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await pool.query('SELECT * FROM posts');
        res.json(posts.rows);

        console.log('posts: ', posts)
    } catch (error) {
        console.error('Error getting posts.', error)
    }
});

// get all users

app.get('/users', async (req, res) => {
    try {
        const users = await pool.sql`
            select email, user_name, image_url
            from users
        `;
        res.json(users.rows);

        res.json(users)
    } catch (error) {
        console.error('Error getting users.', error)
    }
});

// app.get('/users', async (req, res) => {
//     try {
//         const users = await pool.query('SELECT email, user_name, image_url FROM users;');
//         res.json(users.rows);
//     } catch (error) {
//         console.error('Error getting users.', error)
//     }
// });

// a working method but a different one is needed
// app.get('/users', async (req, res) => {

//     try {
//       const { data, error } = await supabase.from('users').select('*');
//       if (error) {
//         throw error;
//       }
//       res.json(data.rows);

//       console.log(data)
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
// });
  


// create a new article
app.post('/posts', async (req, res) => {
    const { user_email, title, content, post_date, category, image_url } = req.body;

    const id = uuidv4();

    try {
        const newArticle = await pool.query(`INSERT INTO "posts"(id, user_email, title, content, post_date, category, image_url) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [id, user_email, title, content, post_date, category, image_url]);

        res.json(newArticle.rows[0])
    } catch (error) {
        console.error(error)
    }
});

// edit an article
app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { user_email, title, content, post_date, category, image_url } = req.body;

    try {
        const editedArticle = await pool.query('UPDATE posts SET user_email = $1, title = $2, content = $3, post_date = $4, category = $5, image_url = $6 WHERE id = $7;', [user_email, title, content, post_date, category, image_url, id]);
        res.json(editedArticle);
    } catch (error) {
        console.error(error);
    }
});

// delete a post
app.delete('/delete-post/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedPost = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        res.json(deletedPost);
    } catch (error) {
        console.log('error deleting a post')
    }
})

// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (!users.rows.length) {
            return res.json('User does not exist')
        };

        const success = await bcrypt.compare(password, users.rows[0].hashed_password);
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

        if (success) {
            res.json({ 'email': users.rows[0].email, token, 'userName': users.rows[0].user_name, 'imageUrl': users.rows[0].image_url })
        } else if (!success) {
            res.json({status: 400, errorText: 'Incorrect email or password'})
        } else {
            res.json('Logging in has not been successful.')
        }

    } catch (error) {
        console.error('error logging in: ', error);
    }
});

// register
app.post('/register', async (req, res) => {

    const { username, email, password, IMAGE_URL } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const register = await pool.query('INSERT INTO users (email, user_name, hashed_password, image_url) VALUES($1, $2, $3, $4)', [email, username, hashedPassword, IMAGE_URL]);

        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

        res.json({ status: 200, email, token, 'userName': username, 'imageUrl': IMAGE_URL });

    } catch (error) {
        res.json({status: 500, errorText: 'Error registering the user.'});
    }
});

// update a user profile
app.put('/update-profile', async (req, res) => {
    const { userEmail, image, name } = req.body;

    try {
        const editedUser = await pool.query('UPDATE users SET image_url = $1, user_name = $2 WHERE email = $3;', [image, name, userEmail]);
        res.json(editedUser);
    } catch (error) {
        console.error(error);
    }
});

// delete a user 
app.delete('/delete-profile/:userEmail', async (req, res) => {

    const { userEmail } = req.params;

    try {
        const deletedUser = await pool.query('DELETE FROM users WHERE email = $1', [userEmail]);
        res.json(deletedUser);
    } catch (error) {
        console.log('error deleting a post', error)
    }
})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));