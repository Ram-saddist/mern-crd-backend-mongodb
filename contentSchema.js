const mongoose=require("mongoose");

const contentSchema={
	date:String,
	content:String
}
const Content = mongoose.model("Content",contentSchema);

module.exports=Content;