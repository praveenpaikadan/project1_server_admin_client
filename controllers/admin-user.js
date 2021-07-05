const AdminUser = require('../models/admin-user')

//show the list of employees

// const index = (req, res, next) => {
//     Employee.find()
//     .then(response => {
//         res.json({
//             response
//         })
//     })
//     .catch(error => {
//         console.log(err)
//         res.json({
//             message: 'An error Ocuured'
//         })
//     })
// } 

// ONly return One employee with id

// const show = (req, res, next) => {
//     let employeeID = req.body.employeeID
//     Employee.findById(employeeID)
//     .then(response=> {
//         res.json(response)
//     })
//     .catch(error => {
//         console.log(err)
//         res.json({
//             message : 'An error occured'
//         })
//     })
// }

// adding employee data to database

const save = (req, res, next) => {
    let adminUser = new AdminUser({
        name: req.body.name,
        designation: req.body.designation,
        email: req.body.email,
        previlage: req.body.previlage,
        password: req.body.password,
    })
    console.log(req)
    employee.save()   
    .then(response => {
        res.json({
            status: 1,
            response 
        })
    })
    .catch(error => {
        res.json({
            status: 0,
        })
    })
}


// // Update employyee details with id
// const update = (req, res, next) => {
//     let employeeID = req.body.employeeID 
//     let updateData = {
//         name : req.body.name,
//         designation : req.body.designation,
//         email: req.body.email,
//         age: req.body.age
//     }

//     Employee.findByIdAndUpdate(employeeID, {$set: updateData}) // return promise
//     .then(() => {
//         res.json({
//             message: 'updated Succesfully'
//         })
//     })
//     .catch(()=>{
//         res.json({
//             message: 'update failed'
//         })
//     })
// }

// // detete an empoyee

// const destroy = (req, res, next) => {
//     let employeeID = req.body.employeeID
//     Employee.findOneAndRemove(employeeID)
//     .then(()=>{
//         res.json({
//             message: 'Deleted Successfully'
//         })
//     })
//     .catch(()=>{
//         res.json({
//             message:"Failed deleteion"
//         })
//     })
// }



// module.exports = {index, show, store, update, destroy }

module.exports = {save}