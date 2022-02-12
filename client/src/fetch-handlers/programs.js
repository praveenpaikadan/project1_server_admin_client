import {BASE_URL} from '../App';
import axios from 'axios';

async function getAllProgramData()  {
    let res = await axios.get(BASE_URL+`/programs`)
    let fetchedData = await res.data.response
    return fetchedData
}

async function getAllWorkoutData()  {
    let res = await axios.get(BASE_URL+`/workouts`)
    let fetchedData = await res.data.response
    return fetchedData
}

async function getProgramDataByID(id){
    let res = await axios.get(BASE_URL+`/programs/${id}`)
    let fetchedData = await res.data.response
    return fetchedData
}

async function getWorkoutDataByWorkoutID(workoutID) {
    let res = await axios.get(BASE_URL+`/workouts?workoutID=`+workoutID)
    let fetchedData = await res.data.response
    return fetchedData
}

async function getAllWorkoutsByUserID(userID) {
    let res = await axios.get(BASE_URL+`/workouts?userID=`+userID)
    let fetchedData = await res.data.response
    return fetchedData
}

export {getAllProgramData, getProgramDataByID, getAllWorkoutData, getWorkoutDataByWorkoutID, getAllWorkoutsByUserID}