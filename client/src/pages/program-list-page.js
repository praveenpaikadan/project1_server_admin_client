import { Avatar } from '@material-ui/core';
import av from '../assets/profile.jpg'
import ListPage from './list-page'
import { getAllProgramData } from '../fetch-handlers/programs';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const spacing = [300, 250, 200, 150] 


const topTabs = ['Active Clients', 'Inactive Clients', 'All Clients' ]

const headers = [
  'Program Name', 
  'Key Words', 
  'Active Status', 
  'Program Type'
]

function ProgramListPage() {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProgramData()
    .then((fetchedData) => {
      var formatted = fetchedData.map((item) => {if(item.type === true){item.type = 'Public'}else if(item.type === false){item.type = 'Privet'}; return item })
      setData(formatted)
      setLoading(false)
    })
    .catch(err => {
      toast.error('Failed to fetch program list. Please reload the page')
      setLoading(false)
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
        loading={loading}
    />
  );
}

export default ProgramListPage;
