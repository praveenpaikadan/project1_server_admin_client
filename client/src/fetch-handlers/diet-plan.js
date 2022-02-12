import {BASE_URL} from '../App';
import axios from 'axios';

async function getAllDietPlanData()  {
    let res = await axios.get(BASE_URL+`/diet-plan`)
    let fetchedData = await res.data.response
    return fetchedData
}

async function getDietPlanData(id)  {
    let res = await axios.get(BASE_URL+`/diet-plan/${id}`)
    let fetchedData = await res.data.response
    return fetchedData
}

async function getDietPlanIDByUserIDAndProgramID(userID, programID)  {
    let res = await axios.get(BASE_URL+`/diet-plan/getid?userID=${userID}&programID=${programID}`)
    console.log(res.data)
    let fetchedData = await res.data.response
    return fetchedData
}

export {getAllDietPlanData, getDietPlanData, getDietPlanIDByUserIDAndProgramID}