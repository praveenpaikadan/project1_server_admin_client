import {BASE_URL} from '../App';
import axios from 'axios';

async function getCurrentUserData()  {
    let res = await axios.get(BASE_URL+`/adminusers/current`)
    let fetchedData = await res.data.response
    return fetchedData
}

async function getCredentials(data) { 
    let res = await axios.post(BASE_URL + '/login', data)
    let fetchedData = await res.data.response
    return fetchedData
}

async function logout(data) { 
    let res = await axios.get(BASE_URL + '/logout')
    return res
}

export {getCurrentUserData, getCredentials, logout}