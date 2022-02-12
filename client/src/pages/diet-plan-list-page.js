import { Avatar } from '@material-ui/core';
import av from '../assets/profile.jpg'
import ListPage from './list-page'
import { getAllDietPlanData } from '../fetch-handlers/diet-plan';
import { useState, useEffect } from 'react';
const spacing = [300, 250, 200, 150] 


const topTabs = ['Active Diet Plan', 'Inactive Diet Plans', 'All Diet Plans' ]

const headers = [
  'Plan Name', 
  'description', 
  'Client', 
  'Status'
]

function DietPlanListPage() {

  const [data, setData] = useState([])


  useEffect(() => {
    getAllDietPlanData()
    .then((fetchedData) => {
      console.log(fetchedData)
      var formatted = fetchedData.map((item) => {if(item.type === true){item.type = 'Public'}else if(item.type === false){item.type = 'Privet'}; item.username = item.client.userName; return item })
      setData(formatted)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])
  
  const mainDataClickHandler = (id) => {
    console.log(id)
  }

  const topTabClickHandler = (index) => {
    console.log(index)
  }
 
  return (
    < ListPage 
        heading="Diet Plans"
        topTabs={topTabs} 
        spacing= {spacing}
        headers= {headers}
        mainData= {data}
        topTabs= {topTabs}
        topTabClickHandler = {topTabClickHandler}
        displayItems={['planName', 'description', 'username', 'active' ]}
    />
  );
}

export default DietPlanListPage;
