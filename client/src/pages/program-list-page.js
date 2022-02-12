import { Avatar } from '@material-ui/core';
import av from '../assets/profile.jpg'
import ListPage from './list-page'
import { getAllProgramData } from '../fetch-handlers/programs';
import { useState, useEffect } from 'react';
const spacing = [300, 250, 200, 150] 

const avatarName = (name, uri) => (
  <div style={{display: 'flex', alignItems:'center'}}>
    <Avatar alt={name} src={av} style={{height: '2.5em', width: '2.5em' }}/>
    <p style={{marginLeft: '10px'}}>{name}</p>
  </div>
)


const topTabs = ['Active Clients', 'Inactive Clients', 'All Clients' ]

const headers = [
  'Program Name', 
  'Key Words', 
  'Active Status', 
  'Program Type'
]

function ProgramListPage() {

  const [data, setData] = useState([])

  useEffect(() => {
    getAllProgramData()
    .then((fetchedData) => {
      var formatted = fetchedData.map((item) => {if(item.type === true){item.type = 'Public'}else if(item.type === false){item.type = 'Privet'}; return item })
      setData(formatted)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])



  const topTabClickHandler = (index) => {
    console.log(index)
  }
 
  return (
    < ListPage 
        heading="Programs"
        topTabs={topTabs} 
        spacing= {spacing}
        headers= {headers}
        mainData= {data}
        topTabs= {topTabs}
        topTabClickHandler = {topTabClickHandler}
        displayItems={['programName', 'keyWords', 'active', 'type']}
    />
  );
}

export default ProgramListPage;
