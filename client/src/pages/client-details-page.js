import Heading from '../components/heading'
import { RowHead, RowItem } from '../components/rowItems';
import TabNav from '../components/tabnav';
import SideNav from '../components/sidenav';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { useState, useEffect } from 'react';
import './details-page.css'; 
import { Avatar } from '@material-ui/core';
import av from '../assets/profile.jpg'
import './client-details-page.css'; 
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import { getClientDetails } from '../fetch-handlers/clients';
import { useParams, useHistory, useRouteMatch } from 'react-router';
import { toast } from 'react-toastify';
import Loader from '../components/loader';
import { getServerMediaUrl, convertdmy_to_myd } from '../utilities/helpers';
import { getAllProgramData, getAllWorkoutsByUserID, getProgramDataByID, getWorkoutDataByWorkoutID } from '../fetch-handlers/programs';
import { getDietPlanIDByUserIDAndProgramID } from '../fetch-handlers/diet-plan';

{/*

    INPUT DATA : 
        - PAGE HEADER
        - SPACING
        - HEADERS
        - DISPLAY DATA
        - ITEM CLICK HANDLER


*/}


const ProfileDetails = ({clientData}) => {

    if(!clientData){
        return(
            <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader /></div>
        ) 
    }

    if(clientData === -1){
        return(
            <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><p>Failed to obtain client data</p></div>
        ) 
    }

    return(
        <div style={{width:'100%'}}>
            <Avatar alt={clientData.name} src={clientData.profilePhoto? getServerMediaUrl(clientData.profilePhoto.filename): null} style={{height: '7em', width: '7em', margin:'auto' }}/>
            <div className='mainName' style={{fontSize: '22px'}}>{clientData.name}</div>
            <div className='contactContainer'>
                <div className='contact' style={{margin: 10}}> <EmailIcon className='contactIcon'/>{clientData.email}</div>
                <div className='contact' style={{margin: 10}}> <PhoneIcon className='contactIcon'/>{clientData.phone || 'N/A'}</div>
            </div>
            <div className='otherDetailsContainer'>
                <div className='detailsItemContainer'>
                    <div className='detailsKey'>Gender :  </div>
                    <div className='detailsValue'>{clientData.gender}</div>
                </div>
                <div className='detailsItemContainer'>
                    <div className='detailsKey'>DOB : </div>
                    <div className='detailsValue'>{clientData.dob}</div>
                </div>
                <div className='detailsItemContainer'>
                    <div className='detailsKey'>Height : </div>
                    <div className='detailsValue'>{clientData.height || 'N/A'} cm</div>
                </div>
                <div className='detailsItemContainer'>
                    <div className='detailsKey'>Weight : </div>
                    <div className='detailsValue'>{clientData.weight || 'N/A'} kg</div>
                </div>

                <div className='detailsItemContainer'>
                    <div className='detailsKey'>BMI : </div>
                    <div className='detailsValue'>{clientData.weight / clientData.height /clientData.height * 10000}</div>
                </div>

                <div className='detailsItemContainer'>
                    <div className='detailsKey'>Registered Date : </div>
                    <div className='detailsValue'>{new Date(clientData.createdAt).toDateString()}</div>
                </div>

                <div className='detailsItemContainer'>
                    <div className='detailsKey'>Last Tracked On : </div>
                    <div className='detailsValue'>{new Date(clientData.updatedAt).toDateString()}</div>
                </div>
            </div>
        </div>
    )
}

const WorkoutItem = ({data}) => {
    return(
        <div className="workout-item">
            <p><b>{`Day ${data.day}`}</b>{` (${(new Date(convertdmy_to_myd(data.date)).toDateString())})`}</p>
            <div style={{height: '120px', overflow: 'scroll'}}>
            <div className='exercises-container' style={{margin: 0}}>
               {data.workout.map((exercise, exIndex) => (
                   <div key={data._id + String(exIndex)} className='exercise-item__' style={{marginBottom: 0}}>
                       <p>{`${exercise.exerciseNumber}. ${exercise.exerciseName}`}</p>
                       <div>
                           {exercise.reps.map((set, index) => (
                               <p key={data._id + String(exIndex) + String(index)} className='set-item'>{`Set ${index}: ${set} ${exercise.repetitionType}`}</p>
                            ))}
                        </div>
                   </div>
               ))}
            </div>
            </div>
        </div>
    )
}

const WorkoutDetails = ({workoutID, userID}) => {

    let history = useHistory();

    const [workoutData, setWorkoutData] = useState(null)
    const [loading, setLoading] = useState(false);
    const [dietPlanID, setDietplanID] = useState(null)
 
    const getWorkoutAndProgramDetailsByWorkoutID = async (workoutID) => {
        try{
            var workout = await getWorkoutDataByWorkoutID(workoutID)
            var program = await getProgramDataByID(workout.programID)
            workout.program = program
            console.log(workout)
            return workout
        }catch(error){
            console.log(error)
            return null
        }
    }

    useEffect(() => {
      setLoading(true)
      getWorkoutAndProgramDetailsByWorkoutID(workoutID)
      .then((workoutData) => {
            getDietPlanIDByUserIDAndProgramID(userID, workoutData.programID)
            .then((response) => {
                console.log(response)
                setDietplanID(response? response._id: null);
                
                setWorkoutData(workoutData); 
                setLoading(false)
            })
      })
      .catch((error) => {
          setWorkoutData(-1);
          setLoading(false) 
      }) 
      return () => {
        
      };
    }, [workoutID]);
    

    if(loading){
        return <Loader position={'center'}/>
    }else if(workoutID === null ){
        return <div style={{height: '100%', width: '100%'}}><p style={{margin: 'auto', marginTop: '100px', display: 'inline'}}>No workout selected</p></div>
    }else if(workoutID === -1 || workoutData === -1 ){
        return <div style={{height: '100%', width: '100%'}}><p style={{margin: 'auto', marginTop: '100px', display: 'inline'}}>Something Happened. Refresh to try Again</p></div>
    }else if(workoutData){
        return(
            <div className='form' style={{width: '100%', display:'flex',  flexDirection:'column', justifyContent:'center'}}>
                <div className="button-container" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                    <button onClick={() => {history.push('/dashboard/programs/'+ workoutData.programID)}} type="submit" class="btn btn-success btn-block btn-sm link-btn">View/ Edit Program</button> 
                    <button onClick={() => {history.push('/dashboard/diet-plan/'+ (dietPlanID?dietPlanID:'add'))}} type="submit" class="btn btn-success btn-block btn-sm link-btn">{`${dietPlanID?'View/ Edit/':'Add'} Diet Plan`}</button>
                </div>
                {workoutData.history.map(item => <WorkoutItem data={item}/>)}
            </div>
        )
    }else{ 
        return null
    }
}

const ClientDetailsPage = () => {
    const {id} = useParams()

    const [clientData, setClientData] = useState(null)
    const [clientLoading, setClientLoading] = useState(true)
    const [workoutsList, setWorkoutsList] = useState(null)
    const [activeWorkoutID, setActiveWorkoutID] = useState(null)
    

    useEffect(() => {
        getClientDetails(id)
        .then((client) => {
            setClientData(client)
            setClientLoading(false)
            if(client){
                getAllWorkoutsByUserID(client._id)
                .then((workoutArray) => {
                    getAllProgramData()
                    .then(programArray => {
                        workoutArray = (workoutArray || []).map((workout, index) => {
                            workout.program = programArray.find(program => program._id === workout.programID)
                            return workout
                        })
                        setWorkoutsList(workoutArray)
                        console.log(workoutArray)
                        if(workoutArray[0]){
                            setActiveWorkoutID(workoutArray[0]['_id'])
                        }
                    })
                })

            }
        })
        .catch((error) => {
            console.log(error)
            setClientData(-1)
            setClientLoading(false)
            toast.error('Unable to fetch client details')
        })
      }, []);
      
    return (
        <div className='main'>
            <div className='container'>
                <div className='wrapperContainer'>
                    <div className='unScrollableContainer'>
                    {workoutsList && workoutsList[0] ?
                        <select onChange={(e) => {setActiveWorkoutID(e.target.value)}} className='activeProgramHeading' style={{outline: 0, borderTop: 0, borderLeft: 0, borderRight: 0, fontSize: '25px'}}>
                            {workoutsList.map((workout, index) => {
                                return <option style={{fontSize: '20px' }}key={String(index)} value={workout._id} className='activeProgramHeading'>{workout.program.programName + (clientData.currentWorkout?(workout._id === clientData.currentWorkout.workoutID?' (Active)':''):'')}</option>
                            })}
                        </select>:null}
                    </div>

                    <div className='scrollableContainer'> 
                       {/* <ProgramForm /> */}
                        <WorkoutDetails userID={id} workoutID={activeWorkoutID}/>
                        
                    </div>
                </div>
            </div>

            <div className='rightContainer'>
                <ProfileDetails clientData={clientData} loading={clientLoading}/>
            </div>
        </div>    
  );
}



export default ClientDetailsPage;
