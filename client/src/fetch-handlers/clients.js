import {BASE_URL} from '../App';
import axios from 'axios';

async function getAllClientData()  {
    let res = await axios.get(BASE_URL+`/clients`)
    let fetchedData = await res.data.response
    return fetchedData
}

async function getClientDetails(id){
    let res = await axios.get(BASE_URL+`/clients/${id}`)
    let fetchedData = await res.data
    return fetchedData
}

export {getAllClientData, getClientDetails}