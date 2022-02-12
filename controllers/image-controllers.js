
const mongoose = require('mongoose')
const Exercise = require('../models/exercise')
const Program = require('../models/program')
var ipAddress = require('ip').address();
const PORT = process.env.PORT;

const getFullMediaUrlIfRelative = (potRelUrl) => {
    if(potRelUrl.substring(0, 7) === `/media/` ){
        return 'http://'+ ipAddress+':'+String(PORT)+'/api/v1'+ potRelUrl
    }else{
        return potRelUrl
    }
}

function checkIfRequestByIDandAlterUrlIfNeeded(req,res, next){
    var baseUrl = req.originalUrl.replace(req.url, "")
    console.log('baseUrl : ' ,baseUrl )
  
    var {by, id, index} = req.query 

    if(!(by && id && index)){
        next()
        return
    }
    
    if(by === "ExId"){
        Exercise.findOne({_id:id}).select({'coverImage': 1})
        .then(resp => {
            console.log(resp)
            try{
                if(resp["coverImage"]){
                    var imgUrl = getFullMediaUrlIfRelative(resp["coverImage"].trim())
                    console.log(imgUrl)
                    res.redirect(imgUrl)
                }else{
                    res.status(404).end()
                }
                
            }catch(err){
                next()
            }
        })
    }else if(by === "PrId"){
        Program.findOne({_id:id}).select({'images.filename': 1})
        .then(resp => {
            try{
                var filename = resp["images"][index].filename
                res.redirect(baseUrl+'/'+filename)
            }catch(err){
                next()
            }
        })
    }else{
        next()
        return
    }

    
}

module.exports = { checkIfRequestByIDandAlterUrlIfNeeded }