const passport = require("passport");
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

function initialize (passport , getuserbyemail , getuserbyid)
{
    const authenticationuser = async (email , password , done)=>{
    
           const user = getuserbyemail(email)
           if(user == null)
           {
               return done(null , false , {message : 'No user with this email'});
           }

           try{
               
            if(await bcrypt.compare(password , user.password))
            {
                return done(null , user);
            }
            else{
                done(null , false , {message : "password is incorrect"});

            }

           } catch(e){
               
            return done(e);
           }

    }
    passport.use(new LocalStrategy({usernameField : 'email'} , authenticationuser));

    passport.serializeUser((user , done)=> done(null , user.id))
    passport.deserializeUser((id , done) => { 

        return done(null , getuserbyid(id));
    })
}

module.exports = initialize;