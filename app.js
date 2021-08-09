if(process.env.NODE_ENV != 'production')
{
    require('dotenv').config();
}

const express = require('express');
const app = express();
app.set('view-engine' , 'ejs');
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt');
const flash = require('express-flash');
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.urlencoded({extended:false}));

const session = require('express-session');
const initialize = require('./passportconfig');
const passport = require('passport');

app.use(flash());
app.use(session(
    {
         secret : process.env.SESSION_SECRET,
         resave : false,
         saveUninitialized : false

    }
))
app.use(passport.initialize());
app.use(passport.session());
const users = [];


initialize(passport 
    , email => users.find(element => element.email === email)
    , id => users.find(element => element.id === id)

)

app.get('/' , (req , res)=>
{
    res.render('index.ejs');
});

app.get('/login' , (req , res)=>
{
    res.render('login.ejs');
});
app.get('/register' , (req , res)=>
{
    res.render('register.ejs');
});

app.post('/login' , passport.authenticate('local' , 
    {
       successRedirect : '/',
       failureRedirect : '/login',
       failureFlash : true
    }
))
app.post('/register' , async (req , res)=>
{
      let password = await bcrypt.hash(req.body.password,10);
      users.push({
          id : Date.now().toString(),
          name : req.body.name,
          email : req.body.email,
          password : password
      })
      
      console.log("register sucessfully" , users);
      
      res.redirect('/login');
});


app.listen(8000 , (err)=>
{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("running server");
    }
});