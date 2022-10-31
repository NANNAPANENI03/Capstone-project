const express = require('express')
const app = express();
const port = 3000;
const request=require('request');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");
initializeApp({
  credential: cert(serviceAccount)
});
const db=getFirestore();


app.set("view engine","ejs");


app.get("/", (req, res) => {
  res.send('Hello World!')
});

app.get("/signin",(req,res)=>{
  res.render('signin');
});

app.get("/signinsubmit",(req,res)=>{
  const User_Name=req.query.Uname;
  const Password=req.query.Pass;
 

  db.collection("users")
    .where("Uname","==",Uname)
    .where("Pass","==",Pass)
    .get()
    .then((docs)=>{
      if(docs.size>0){
        res.render('TVshowSearch');
    
       }
       else{
        res.send("Login failed ");
       }
    });

});


app.get("/signupsubmit",(req,res)=>{
  const User_Name=req.query.Uname;
  const Password=req.query.Pass;
  const Email_id=req.query.mail;

  db.collection("users")
    .add({
      name:User_Name,
      password:Password,
      email:Email_id

    })
    .then(()=>{
      res.render("signup");
    });

});


app.get("/signup",(req,res)=>{
  res.render('signup');
});

app.get("/tvshowName",function(req,res){
  const nameoftvshow=req.query.TVshowname
  request(
      'http://www.omdbapi.com/?t='+nameoftvshow+'&apikey=4a15ed7a', function (error, response, body) {
if(JSON.parse(body).Response=="True"){
      
    const Poster=JSON.parse(body).Poster;
    const Title=JSON.parse(body).Title;
    const Year= JSON.parse(body).Year;
    const imdbRating= JSON.parse(body).imdbRating;
    const Released =JSON.parse(body).Released;
    const Genre= JSON.parse(body).Genre;
    const Actors= JSON.parse(body).Actors;
    const Plot= JSON.parse(body).Plot ;
   res.render('TVshowinfo',{Poster:Poster,Title:Title,Year:Year,imdbRating:imdbRating,Released:Released,Genre:Genre,Actors:Actors,Plot:Plot});
}
else{
   res.render('TVshownotfound');
}
}
);
});


app.get("/gotoTVshowsearch",function(req,res){
  res.render('TVshowsearch');
});

app.listen(port,()=>{console.log("Listening to the server on http://localhost:3000")})