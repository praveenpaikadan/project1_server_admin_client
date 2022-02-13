import { Avatar } from '@material-ui/core';
import av from '../assets/profile.jpg'
import ListPage from './list-page'
import { getAllProgramData } from '../fetch-handlers/programs';
import { useState, useEffect } from 'react';
import { getAllExerciseData } from '../fetch-handlers/exercise';
import { toast } from 'react-toastify';
const spacing = [300, 250, 250] 

const avatarName = (name, uri) => (
  <div style={{display: 'flex', alignItems:'center'}}>
    <Avatar alt={name} src={av} style={{height: '2.5em', width: '2.5em' }}/>
    <p style={{marginLeft: '10px'}}>{name}</p>
  </div>
)


const topTabs = ['Active Clients', 'Inactive Clients', 'All Clients' ]

const headers = [
  'Exercise Name',
  'Repetition Type',
  'Active Status',
]

function ExerciseListPage() {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    getAllExerciseData()
    .then((fetchedData) => {
      setData(fetchedData)
      setLoading(false)
    })
    .catch(err => {
      toast.error('Failed to fetch exercise list. Please reload the page')
      setLoading(false)
    })
  }, [])


  const topTabClickHandler = (index) => {
    console.log(index)
  }
 
  return (
    < ListPage 
        heading="Exercises"
        topTabs={topTabs} 
        spacing= {spacing}
        headers= {headers}
        mainData= {data}
        topTabs= {topTabs}
        topTabClickHandler = {topTabClickHandler}
        displayItems={['exerciseName', 'repetitionType', 'active']}
        loading={loading}
    />
  );
}

export default ExerciseListPage;
