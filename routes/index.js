const express = require('express');
const router = express.Router();
const Chatlog = require('../models/Chatlog');
const connectMongo = require('../config/connection');
const ObjectId = require('mongodb').ObjectId ;
connectMongo();

// POST - Add Chatlog to database 
router.post('/chatlogs/:userid' , async (req,res) => {
    const {message , isSent } = req.body ;
    if( !message || !isSent  )
    {
        return res.status(400).json({
            "message" : "Please field all the details"
        })
    }
    const userid = req.params.userid ;
    const newMessage = new Chatlog({
        message , isSent , author : userid
    })
    try 
    {
        const savedRecord = await newMessage.save();
        console.log("log saved");
        res.status(200).json({
            messageID : savedRecord._id
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            "message" : "Server Error"
        })
    }
})

// GET - Get chatlog from database 
router.get('/chatlogs/:userid' , (req,res) => {
    const limit = req.query.limit ;
    const start = req.query.start ;
    try
    {
        if(limit && start)
        {
            Chatlog.find({
                _id: {
                  $gt: ObjectId(start)
                } , author : req.params.userid
              } ,null,{ sort :{ timestamp : -1} , limit : limit } ,function(err, items) {
                if(items.length > 0)
                {
                    res.status(200).json(items)
                }
                else 
                {
                    res.status(404).json({
                        "message" : "Record Not found"
                    })
                }
            }).clone()
            
        }
        else if(!start && limit)
        {
            Chatlog.find({
                author: req.params.userid
            },null,{ sort :{ timestamp : -1} , limit : limit } , function(err, items) {
                if(items.length > 0)
                {
                    res.status(200).json(items)
                }
                else 
                {
                    res.status(404).json({
                        "message" : "Record Not found"
                    })
                }
            }).clone()
            
        }
        else if(start && !limit)
        {
            Chatlog.find({
                _id: {
                  $gt: ObjectId(start)
                } , author : req.params.userid
              } ,null,{ sort :{ timestamp : -1} , limit : 10 } ,function(err, items) {
                if(items.length > 0)
                {
                    res.status(200).json(items)
                }
                else 
                {
                    res.status(404).json({
                        "message" : "Record Not found"
                    })
                }
            } ).clone()
        }
        else 
        {
            Chatlog.find({
                author : req.params.userid
              } ,null,{ sort :{ timestamp : -1} , limit : 10 } ,function(err, items) {
                if(items.length > 0)
                {
                    res.status(200).json(items)
                }
                else 
                {
                    res.status(404).json({
                        "message" : "Record Not found"
                    })
                }
            } ).clone()
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(404).json({
            "message" : "Record Not found"
        })
    }
})

// DELETE - Delete the chatlog by userid
router.delete('/chatlogs/:userid',async (req,res) => {
    let userid = req.params.userid ;
    try 
    {
        let user = await Chatlog.findOne({author : userid });
        if(!user)
        {
            res.status(404).json({
                "message" : "Record Not found"
            })
        }
        else 
        {
            await Chatlog.deleteMany({author : userid });
            res.status(200).json({
                "message" : "Records deleted by userid "
            })
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(404).json({
            "message" : "Record Not found"
        })
    }
    
})

// DELETE - Delete the chatlog by userid and msgid
router.delete('/chatlogs/:userid/:msgid' ,async (req,res) => {
    try
    {
        let user = await Chatlog.findOne({author : req.params.userid , _id : req.params.msgid});
        if(!user)
        {
            res.status(404).json({
                "message" : "Record Not found"
            })
        }
        else 
        {
            await Chatlog.deleteOne({
                author : req.params.userid , _id : req.params.msgid  })
            res.status(200).json({
                "message" : "Records deleted by userid and msgid"
            })
        }
       
    }
    catch(e)
    {
        console.log(e);
        res.status(404).json({
            "message" : "Record Not found"
        })
    }
});

// GET - Home Page 
router.get('/home' , (req,res) => {
    console.log("console home page");
    res.send("Home page");
})

module.exports = router ;