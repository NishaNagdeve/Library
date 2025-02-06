const mongoose=require('mongoose');
const express=require('express');
const bodyparser=require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const app=express();  
const cors=require('cors') ;

app.use(cors({
    origin: "https://library-2pa0.onrender.com",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(fileUpload());
app.use(bodyparser.json());
// const DB="mongodb://localhost:27017/Library";
const DB="mongodb+srv://nagdevenisha:ioLci5ACp1vtU6XF@cluster0.pjsbc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0?ssl=false";
mongoose.connect(DB,{
    useNewUrlParser:true,
}).then(()=>console.log('DB connected'));

const userSchema=new mongoose.Schema({
    name:String,
    password:String
});
const User = mongoose.model('User', userSchema);
app.post('/login',async(req,res)=>{
    const{name,password}=req.body;
    console.log(req.body);

    try{
        const user=await User.findOne({name,password}) ;
        if(user)
        {
            res.status(200).json({ message: 'Login successful' });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials' });
          }
    }
    catch(error)
    {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
})
const bookschema=new mongoose.Schema({
    name:String,
    author:String,
    code:String,
    pdf:String

});
const Books=mongoose.model('Book',bookschema);
app.post('/bookadd',async(req,res)=>{
    console.log(req.body);
    const{name,author,code}=req.body;
    const pdfFile = req.files.pdf;
    const uploadDir = path.join(__dirname, 'uploads');
    const uploadPath = path.join(uploadDir, Date.now() + path.extname(pdfFile.name));
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    try{
            pdfFile.mv(uploadPath, async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'File upload failed' });
                }
    
                // Save book details in the database
                const book = new Books({ name, author, code, pdf: uploadPath });
                await book.save();
    
                res.status(200).json({ message: 'Book added successfully!' });
            });
       
    }
    catch(error)
    {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('/getBooks',async(req,res)=>{
    try{
        console.log("getting books.....");
    const data=await Books.find().select('name code -_id');
    res.status(200).json(data);
    }
    catch(error)
    {
         res.status(500);
    }
})
app.get('/getbook',async(req,res)=>{

    const{code}=req.query;
    console.log(code);
    try{
    const data=await Books.find({code:code}).select('name author -_id');
    console.log(data);
    res.status(200).json(data);
    }
    catch(error)
    {
         res.status(500);
    }
})
const memberschema=new mongoose.Schema({
     name:String,
     standard:String,
     address:String,
     libraryId:String
});
const Members=new mongoose.model('Members',memberschema);
app.post('/savemember',async(req,res)=>{
    
    const{name,std,addr,id}=req.body;
    try{
           const member=new Members({name:name,standard:std,address:addr,libraryId:id});
           await member.save();
           res.status(200).send({ message: 'Member added successfully' });;
    }
    catch(error)
    {
        console.error(error);
    }
})
const issuebookschema=new mongoose.Schema({
     libraryId:String,
     bookcode:String,
     issuedate:String,
     returndate:String
})
const issueBooks=new mongoose.model('issueBooks',issuebookschema);
app.post('/bookissue',async(req,res)=>{

    const{id,code,issue,returndate}=req.body;
    try{
          const books=new issueBooks({libraryId:id,bookcode:code,issuedate:issue,returndate:returndate});
          await books.save();
          res.status(200).send({message:'BOOK Isssued'});
    }
    catch(error)
    {
        console.log(error);
    }
})

app.get('/bookissue',async(req,res)=>{

      const{code,id}=req.query;
      console.log(req.query);
      try{
                 const result= await issueBooks.find({libraryId:id,bookcode:code}).select('returndate -_id').lean();
                 console.log(result);
                 res.status(200).json(result.map(item=>({returndate:item.returndate})));
        }
      catch(error){
                console.log(error);
      }
})

app.get('/checkbook',async(req,res)=>{
     const{code} =req.query;
     console.log(code);
     try
     {
           const result=await issueBooks.find({bookcode:String(code)});
           console.log(result.length);
           if (result.length === 0) {
            res.status(200).json(result.length);//0
        } else {
            res.status(200).json(result.length);//1
        }
     }
     catch(err)
     {
         console.log(err);
     }
})

app.delete('/deletebook',async(req,res)=>{
     const{code}=req.query;
     try
     {
          await Books.deleteOne({code:code});
          res.status(200).send({message:'Book deleted'});
     }
     catch(error)
     {
          res.status(500).send({message:'Book Not deleted'});
     }
})
const returnbookschema=new mongoose.Schema({
     libraryId:String,
     bookCode:String,
     expectedReturnDate:String,
     actualReturnDate:String,
     due:Number
})
const returnbook=new mongoose.model('returnbook',returnbookschema);
app.post('/returnbook',async(req,res)=>{
      
       const{id,code,expectedReturndate,returndate,due}=req.body;
       try
       {                                                              
           const books=returnbook({libraryId:id,bookCode:code,expectedReturnDate:expectedReturndate,actualReturnDate:returndate,due:due});
           await books.save();
           res.status(200).send({message:'Book return succefully'});
       }
       catch(error)
       {
         res.status(500).send({message:'Book returning failed!!!'});
       }
})

app.get('/getmember',async(req,res)=>{

     const{id}=req.query;
     try{
            const data=await returnbook.find({libraryId:id}).select('bookCode expectedReturnDate actualReturnDate due -_id');
            res.status(200).json(data);
     } 
     catch(err)
     {
           res.status(500).send({message:'libraray id not found!!!'});
     }
})

app.get('/bookname',async(req,res)=>{
      
    const{code} =req.query;
    console.log(code);
     try{
              const name=await Books.find({code:String(code)}).select('name -_id');
              console.log(name);
              res.status(200).json(name);
     }
     catch(err)
     {
         res.status(200).send({message:'book not found'});
     }
})
app.delete('/bookissue',async(req,res)=>{

      const {code}=req.query;
     try{
             await issueBooks.deleteOne({bookcode:String(code)});
             res.status(200).send({message:'deleted from issue books'});
     }
     catch(err)
     {
        res.status(500).send({message:'Issue arised while deleting the book!!!'})
     }
})
const port=3000;
app.listen(port,()=>{

    console.log(`App sunning on port ${port}`);
})