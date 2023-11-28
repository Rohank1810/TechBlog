const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const blogPostArray=require("./data");

require("dotenv").config();
//userData
// const UserData=require("./userDB.js");
const mongoose=require("mongoose");

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

const port=3000 || process.env.PORT;;

app.listen(port,()=>{
    console.log(`connected to port ${port}`);
})

app.use(express.static("public"));

const mongodbURL=process.env.MONGO_URL;
mongoose.connect(mongodbURL)
.then((res)=>{
  console.log("DB Connected success")
}).catch((err)=>{
    console.log("Error occur at DB connection",err);
})

//mongo  schema
const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    imageURL:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

//model
const Blog=new mongoose.model("blog",blogSchema);

app.get("/",(req,res)=>{
    // res.sendFile(__dirname+"/index.html");
    Blog.find({}).then((arr)=>{
        res.render("index",{blogPostArray:arr});
    }).catch((err)=>{
        console.log("Can not find blogs")
        res.render("404")
    })
});

app.get("/contact",(req,res)=>{
    res.render("contact")
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.get("/compose",(req,res)=>{
    res.render("compose");
})

app.post("/compose",(req,res)=>{
//    const newId=blogPostArray.length+1;
   const image=req.body.imageUrl;
   const title=req.body.title;
   const description=req.body.description;

   const newBlog= new Blog({
     imageURL:image,
     title:title,
     description:description
   });

   newBlog.save()
   .then(()=>{
     console.log("Blog added success");
   })
   .catch(()=>{
     console.log("Error in posting Blog");
   })

   //send to home
   res.redirect("/");
})

app.get("/post/:id",(req,res)=>{
    //  console.log(req.params.id);
    const id=req.params.id;
    let title="";
    let imageURL="";
    let description="";
    Blog.findById(id).then((post) => {
        if (post) {
            res.render("post", { post: post });
        } else {
            res.render("404");
        }
    }).catch((err) => {
        console.log("Error finding post:", err);
        res.render("404");
    });
})

//delete
app.get("/delete/:id",(req,res)=>{
    const id=req.params.id;
    Blog.deleteOne({_id:id})
    .then(()=>{
        console.log("Blog Deleted")
    }).catch(()=>{
        console.log("Blog delete Error")
    })
    res.redirect("/");

})
app.get("/signup",(req,res)=>{
    res.render("signup");
})

app.post("/signup",(req,res)=>{
    const email=req.body.email;
   const password=req.body.password;

   const newData= new UserData({
     email:email,
     password:password
   });

   newData.save()
   .then(()=>{
     console.log("User Added Success");
   })
   .catch(()=>{
     console.log("Error in User Adding");
   })

   //send to home
   res.redirect("/");
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    
        const d=await UserData.findOne({email:email})
        if(d.email==req.body.email)
        {
            res.render("index");
        }
        else{
            res.render("login")
        }
})


