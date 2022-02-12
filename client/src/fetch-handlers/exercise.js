import {BASE_URL} from '../App';
import axios from 'axios';

async function getAllExerciseData()  {
    let res = await axios.get(BASE_URL+`/exercises`)
    let fetchedData = await res.data.response
    return fetchedData
}

export {getAllExerciseData}