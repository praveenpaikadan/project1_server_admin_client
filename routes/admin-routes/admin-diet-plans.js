const router   = require('express').Router();
const DietPlan = require('../../models/diet-plan');
const multer = require('multer');



router.get('/getid', (req,res) => {
    
    var {userID, programID} = req.query 

    
    DietPlan.findOne({"client.userID": userID, "client.programID": programID }).select({_id: 1})
    .then(response => {
        res.json({
            response
        })

    })
    .catch(error => {
        console.log(error)
        res.json({
            error: 'An error Ocuured while fetching excercise details'
        })
    })
})

// routes
router.get('/:id', (req,res) => {
    // console.log(req.params.id)
    // if there is no item null is returned.
    DietPlan.findOne({"_id": req.params.id})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: 'An error Ocuured while fetching excercise details'
        })
    })
})

router.get('/', (req,res) => {
    DietPlan.find().select({_id:1, planName: 1, description: 1, client: 1, active: 1, keyWords: 1}).sort({updatedAt: 'descending'})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: 'An error Ocuured while fetching excercise details'
        })
    })
})

router.post('/', (req, res) => {
        var data = req.body

        let dietPlan = new DietPlan(data)
        dietPlan.save()   
        .then(response => {
            res.json(response)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(
                {response: "Failed"}
                )
        })
});

router.patch('/', (req,res) => {
        
        var data = req.body
        var id = data._id

        delete data._id

        let conditions = { _id: id };
    
        DietPlan.findByIdAndUpdate(conditions, data, { new: true})
        .then((response) => {
            res.json({
                response
            })
        })

        .catch(err => {
            console.log(err)
            res.status(400).json({
                response: "Failed to update"
            })
        })
                
    })

router.delete('/:id', (req, res, next)=>{
    let id = req.params.id
    getFilesToBeDeleted(id, ['images', 'videos'])
    .then(filesNamesToBeDeleted => {
        Program.findByIdAndDelete(id)
        .then((response) => {
            deleteFiles(filesNamesToBeDeleted);
            res.json({
                response
            })
        })
        .catch(error => {
            console.log(err)
            res.json({
                response: "Failed to update"
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({
            response: null,
            message: "No Item found"
        })
    })
})

module.exports = router