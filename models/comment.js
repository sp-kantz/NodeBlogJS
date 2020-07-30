let mongoose =require('mongoose');

let commentSchema=mongoose.Schema({
    user_id:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    text:{
        type:String,
        required: true
    },
    article:{
        type:String,
        required: true
    },
    created_at:{
        type:Date,
        required:true
    }
});

let Comment=module.exports=mongoose.model('Comment', commentSchema);