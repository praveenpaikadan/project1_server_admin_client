import { Avatar } from '@material-ui/core';
import av from '../assets/profile.jpg'
import ListPage from './list-page'
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { getAllClientData, getAllClientOverviewData } from '../fetch-handlers/clients';
import { useState, useEffect } from 'react';
import { getServerMediaUrl } from '../utilities/helpers';
import { getAllProgramData, getAllWorkoutData } from '../fetch-handlers/programs';
import { toast } from 'react-toastify';
const spacing = [250, 150, 150, 150, 150] 

const avatarName = (name, uri) => (
  <div style={{display: 'flex', alignItems:'center'}}>
    <Avatar alt={name} src={uri} style={{height: '2.5em', width: '2.5em' }}/>
    <p style={{marginLeft: '10px'}}>{name}</p>
  </div>
)


const topTabs = ['Active Clients', 'Inactive Clients', 'All Clients' ]

const headers = [
  'Client', 
  'Active Program', 
  'Program Type', 
  'Last Tracked',  
  'Program Status',
]


function ClientListPage() {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)


  // Need optimization. Do all the fetching within server side
  // useEffect(() => {
  //   getAllClientData()
  //   .then((fetchedData) => {
  //     getAllProgramData()
  //     .then((programArray) => {
  //       getAllWorkoutData()
  //       .then((workoutDataArray) => {
  //         var formatted = fetchedData.map((user) => {
  //           var currentWorkout = user.currentWorkout
  //           var currentProgram = programArray.find(program => program._id === (currentWorkout?currentWorkout.programID:null))
  //           var currentWorkoutData = workoutDataArray.find(workout => workout._id === (currentWorkout?currentWorkout.workoutID:null))

  //           user.avatarName = avatarName(user.name, user.profilePhoto? getServerMediaUrl(user.profilePhoto.filename): null)
  //           user.currentProgram = currentProgram? currentProgram['programName']: null
  //           user.programType = currentProgram? (currentProgram['type']?'Public':'Custom'): null

  //           user.keyWords = user.name + ' ('+user.email+')'

  //           user.lastDateTracked = currentWorkoutData? new Date(currentWorkoutData['updatedAt']).toDateString(): null
            
  //           user.unlockedDays = user.currentWorkout? user.currentWorkout['unlockedDays']: null
  //           user.totalDays = currentProgram? (currentProgram['durationWeeks'] * currentProgram['daysPerWeek']) : null
  //           user.programStatus = (user.unlockedDays?user.unlockedDays: '-') + '/' + (user.totalDays?user.totalDays:'-')  
  //           return user
  //       })
  //       console.log(formatted)
  //       setData(formatted)
  //       setLoading(false)
  //       })
  //       .catch(err => {
  //         console.log(err)
  //         toast.error('Something happened. Please reload the page')
  //         setLoading(false)
  //       })
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       toast.error('Something happened. Please reload the page')
  //       setLoading(false)
  //     })   
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     toast.error('Something happened. Please reload the page')
  //     setLoading(false)
  //   })
  // }, [])

  const topTabClickHandler = (index) => {
    console.log(index)
  }

useEffect(() => {
  getAllClientOverviewData()
  .then((fetchedData) => {
    var formatted = fetchedData.map((user) => {
      user.avatarName = avatarName(user.name, user.profilePhoto? getServerMediaUrl(user.profilePhoto.filename): null)
      return user
    })
    console.log(formatted)
    setData(formatted)
    setLoading(false)
  })
  .catch(err => {
    console.log(err)
    toast.error('Failed to fetch client list. Please reload the page')
    setLoading(false)
  })
},[])

 
  return (
    < ListPage 
        heading="Clients"
        topTabs={topTabs} 
        spacing= {spacing}
        headers= {headers}
        mainData= {data}
        // mainDataClickHandler= {mainDataClickHandler}
        topTabs= {topTabs}
        topTabClickHandler = {topTabClickHandler}
        displayItems={['avatarName', 'currentProgram', 'programType', 'lastDateTracked', 'programStatus']}
        loading={loading}
    />
  );
}

export default ClientListPage;
