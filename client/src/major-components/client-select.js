import {AvatarName} from "../components/avatar-name";
import {useState} from 'react';
import Fixedbox from '../components/fixed-box';
import  { useEffect } from 'react';
import axios from "axios";
import {BASE_URL} from '../App'
import Loader from "../components/loader";
import { toast } from "react-toastify";
import { getServerMediaUrl } from "../utilities/helpers";
import { getAllClientData } from "../fetch-handlers/clients";
import { Autocomplete, TextField } from "@mui/material";

const MultiSelectClientList = ({label, setPrivateClients, dv, single, disabled}) => {

    const [selectedClients, setSelectedClients] = useState([])

    const [dataList, setDataList] = useState([])

    const [isLoading, setIsLoading] = useState(true)

    async function getAllClients()  {
        let res = await axios.get(BASE_URL+`/clients`)
        let fetchedData = await res.data.response
        return fetchedData
    }
    
    useEffect(() => {
        getAllClientData()
        .then(fetchedData => {
            if (fetchedData !== null){
                fetchedData = fetchedData.map((item) => { return {userID: item._id, name: item.name, email: item.email, profilePhoto: (item.profilePhoto && item.profilePhoto.filename)?  getServerMediaUrl(item.profilePhoto.filename): null }} )
                setIsLoading(false)
                setDataList(fetchedData)
        }})
        .catch(err => {
            console.log(err);
            toast.error('Failed to fetch Client data')
        });
    }, [])

    
    useEffect(() => {
        if(dv){
            setSelectedClients(dv)
            var indicesToDelete = []
            for (var client of dv){
                var updatedDataList = [...dataList]
                var index = dataList.findIndex(item => item.userID === client.userID)
                indicesToDelete = [...indicesToDelete, index]
            }
            var updatedDataList = [...dataList]
            for (var i of indicesToDelete){
                updatedDataList.splice(i, 1);
            }
            setDataList(updatedDataList)}
    }, [])

    const handleClientSelect = (client, index) => {
        console.log(client)
        var updatedSelectedClients = [...selectedClients]
        var existingIndex = updatedSelectedClients.findIndex((item) =>  item.userID === client.userID)
        console.log(existingIndex)
        updatedSelectedClients.push(client)
        if(existingIndex === -1){
            setSelectedClients(updatedSelectedClients)
            setPrivateClients(updatedSelectedClients)
        }        
        // var updatedDataList = [...dataList]
        // updatedDataList.splice(index, 1);
        // setDataList(updatedDataList)
    }

    
    const handleClientDelete = (client, index) => {
        // console.log(client, index)
        // var updatedDataList = [...dataList]
        // if((updatedDataList.find((item) => item.userID === client.userID)) === undefined){
        //     updatedDataList.push(client)
        //     setDataList(updatedDataList)
        //     console.log(updatedDataList)
        // }
        
        var updatedSelectedClients = [...selectedClients]
        updatedSelectedClients.splice(index, 1);
        setSelectedClients(updatedSelectedClients)
        setPrivateClients(updatedSelectedClients)
        setSearch2('')
    }

    const [boxStatus, setBoxStatus] = useState(false)
    
    const handleAddClick = () => {
        setBoxStatus(true)    
    }

    const [search, setSearch] = useState('')
    const [search2, setSearch2] = useState('')
   
    if(isLoading){
        return(<Loader position={'center'} />)
    }else{
        return(
            <div>
                <label>{label}</label>

                <div>
                    <button disabled ={(single && selectedClients.length>0) || disabled} class="btn btn-success" onClick={e => {e.preventDefault(); handleAddClick(e)}}>Add Client</button>
                </div>
                <br/>
                {boxStatus && !(single && selectedClients.length>0)
                ?
                <Fixedbox setBoxStatus ={setBoxStatus}>
                    <div>
                    <Autocomplete
                        disablePortal
                        // freeSolo={true}
                        onChange={(e, v) => {setSearch((v && v.label)?v.label:'')}}
                        id="combo-box-demo"
                        options={dataList.map((item) => {return({label: `${item.name} (${item.email})`})})}
                        sx={{margin: '8px'}}
                        // sx={{ maxWidth: 300, marginLeft:'auto', marginRight: '60px',marginTop: '40px', marginBottom: '40px',...searchBoxStyle }}
                        renderInput={(params) => <TextField fullwidth value={search} onChange={(e) => {setSearch(e.target.value)}} {...params} label={`Search clients`} />}
                    />
                    {dataList.filter(item => ((item.name + item.email).includes(search) || search.includes(item.name) || search.includes(item.email))).map((item, index) => (
                            <div key={item._id} onClick={e => {e.preventDefault(); handleClientSelect(item, index)}}>  
                                <AvatarName name={item.name} email={item.email} uri={item.profilePhoto}/>
                            </div>
                        ))}
                    </div>
                </Fixedbox>
                :
                <></>}

                <div>
                {selectedClients.length>3? <Autocomplete
                            disablePortal
                            // freeSolo={true}
                            onChange={(e, v) => {setSearch2((v && v.label)?v.label:'')}}
                            id="combo-box-demo"
                            options={selectedClients.map((item) => {return({label: `${item.name} (${item.email})`})})}
                            sx={{margin: '8px'}}
                            // sx={{ maxWidth: 300, marginLeft:'auto', marginRight: '60px',marginTop: '40px', marginBottom: '40px',...searchBoxStyle }}
                            renderInput={(params) => <TextField fullwidth value={search2} onChange={(e) => {setSearch2(e.target.value)}} {...params} label={`Search clients`} />}
                        />:null}
                <div style={{width: '100%', maxWidth: '300px', disply: 'block', maxHeight: '300px', overflowY:'scroll'}}>
                    
                        {selectedClients.filter(item => ((item.name + item.email).includes(search2) || search2.includes(item.name) || search2.includes(item.email))).map((item, index) => {
                            return(
                        <div className = 'delete-hoverable' key={item.userID} style={{width: '300px', overflow:'hidden', marginRight: '10px', margin: '5px'}}onClick={e => {e.preventDefault(); handleClientDelete(item, index)}}>  
                            <AvatarName name={item.name} email={item.email} uri={item.profilePhoto}/>
                        </div>)
                        })}
                </div>
                </div>
            </div>
        )
    }
}

export default MultiSelectClientList;