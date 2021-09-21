const express= require('express');
const app= express();
const cors= require("cors");
const mongoose=require("mongoose");
const Content=require("./contentSchema")
const bodyParser = require('body-parser')
const Pusher = require("pusher");
const port =2005;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//mongo connection
mongoose.connect("mongodb+srv://mounika:mounika@cluster0.bb48r.mongodb.net/myworklist")


//pusher connection
const pusher = new Pusher({
  appId: "1263426",
  key: "2ba2c2d4fcf289e8295a",
  secret: "3a7e4c1238144fd42e69",
  cluster: "ap2",
  useTLS: true
});

app.get('/',(req,res)=>{
	res.send("working")
})

app.post("/create",async (req,res)=>{
	const {date,content}=req.body;
	const newContent= new Content({
		date,
		content
	});
	await newContent.save().then(c=>{
		pusher.trigger("content", "insert", 
				{
				  date:c.date,
				  content:c.content
				}
			);
		return res.json({success:true})
	});
})


app.delete('/delete/:id',(req,res)=>{
	const id=req.params.id;
	Content.findByIdAndRemove(id).exec();
})

app.get("/get",async(req,res)=>{
	await Content.find()
	.then(found=>res.json(found))
})

app.listen(port,()=>console.log("running on port 2005"))