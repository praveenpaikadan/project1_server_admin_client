
const mongoose = require('moNgoose')
const Exercise = require('../models/exercise')
const Program = require('../models/program')


function checkIfRequestByIDandAlterUrlIfNeeded(req,res, next){
    var baseUrl = req.originalUrl.replace(req.url, "")
    console.log(baseUrl)
  
    var {by, id, index} = req.query 

    if(!(by && id && index)){
        next()
        return
    }
    if(by === "ExId"){
        Exercise.findOne({_id:id}).select({'images.filename': 1})
        .then(resp => {
            try{
                var filename = resp["images"][index].filename
                res.redirect(baseUrl+'/'+filename)
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