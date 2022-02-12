import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Loader from '../components/loader';

//{label, name, register, errors, required=true, options}


const DeleteExerciseButton = ({exercises, handleDeleteExercise, dayIndex}) => {
    if (exercises.length >= 2){
        return (<button class="btn btn-danger" onClick={(e) => {e.preventDefault(); return handleDeleteExercise(dayIndex)}}>Delete Exercise</button>)
    }else{
        return (<></>)
    }
}

const AddExerciseButton = ({handleAddExercise, dayIndex}) => {
    return (<button class="btn btn-success" onClick={(e) => {e.preventDefault(); return handleAddExercise(dayIndex)}}>Add Exercise</button>)
}

const DeleteDayButton = ({schedule, handleDeleteDay}) => {
    if (schedule.length >= 2){
        return (<button class="btn btn-danger btn-lg" onClick={(e) => {e.preventDefault(); return handleDeleteDay()}}>Delete Day</button>)
    }else{
        return (<></>)
    }
}

const AddDayButton = ({handleAddDay}) => {
    return (<button class="btn btn-success btn-lg" onClick={(e) => {e.preventDefault(); return handleAddDay()}}>Add Day</button>)
}



const Exercise = ({exerciseData, exerciseIndex, dayIndex, handleDataChange, exerciseOptions,dv}) => {

    const [selectedExerciseId, setSelectedExerciseId] = useState(exerciseData['_id']?exerciseData['_id']:false)
    const [repType, setRepType] = useState(exerciseData['repetitionType']?exerciseData['repetitionType']:false)
    const [target, setTarget] = useState(exerciseData['target'])

    const handleExerciseOptionChange = (exerciseIndex, dayIndex, value) => {
        if (value != ""){
            var id = value
            setSelectedExerciseId(id)
            var rType = exerciseOptions.find(exOption => exOption['_id'] == id )['repetitionType']
            rType = rType == 'Time'? 'seconds' : rType
            setRepType(rType)
            handleDataChange(dayIndex, exerciseIndex, 'repetitionType', rType)
            handleDataChange(dayIndex, exerciseIndex, 'exerciseName', exerciseOptions.find(exOption => exOption['_id'] == id )['exerciseName'])
            handleDataChange(dayIndex, exerciseIndex, 'exerciseID', id)
        }else{
            setRepType(false)
            setSelectedExerciseId(false)
        } 
    }

    const addDeleteTarget = (action) => {
        var newTarget = [...target]
        if(action == 1){
            setTarget([...newTarget, ''])
            return
        }

        if(action == -1){
            newTarget.pop()
            setTarget(newTarget)
        }
    }

    const handleTargetChange = (exerciseIndex, dayIndex, value, i) => {
        var newTarget = [...target]
        newTarget[i] = value
        setTarget(newTarget)
        handleDataChange(dayIndex, exerciseIndex, 'target', newTarget)
    } 

    const handleWeightChange = (exerciseIndex, dayIndex, value) => { 
        handleDataChange(dayIndex, exerciseIndex, 'weightInKg', value)
    } 

    const handleRestChange = (exerciseIndex, dayIndex, value) => { 
        handleDataChange(dayIndex, exerciseIndex, 'restInSec', value)
    } 

    const handleRestAfterInMinsChange = (exerciseIndex, dayIndex, value) => { 
        handleDataChange(dayIndex, exerciseIndex, 'restAfterInMins', value)
    } 

    return(
        <fieldset style={{marginLeft: '30px'}}>
            <label>{`Exercise ${exerciseIndex + 1}`}</label>
            <br />

            <div>
                <label>{`Exercise`}</label>
                <select required onChange={e => handleExerciseOptionChange( exerciseIndex, dayIndex, e.target.value)}>
                    <option></option>
                    {exerciseOptions.map((option, index) => {
                        var dfv = false
                        try{dfv = dv?dv[dayIndex]['exercises'][exerciseIndex].exerciseName===option.exerciseName:false}
                        catch(err){}
                        return(
                        <option key={index} selected={dfv} value={option['_id']}>{option['exerciseName']}</option>    
                    )})}
                </select>
            </div>


            {selectedExerciseId !== false? <div>
            
                {target.map((item, i)=>(
                <div>
                    <label>{`Set ${i+1} Target: `}</label>
                    <input required defaultValue={item} onChange={e => handleTargetChange(exerciseIndex, dayIndex,e.target.value, i)}/>
                &nbsp;<label>{repType}</label>
                </div>))
                }
                <div style={{display: 'flex'}}>
                    <button class="btn btn-success btn-sm" onClick={(e) => {e.preventDefault(); return addDeleteTarget(1)}}>Add Set</button>&nbsp;&nbsp;
                    {target.length>1?<button class="btn btn-danger btn-sm" onClick={(e) => {e.preventDefault(); return addDeleteTarget(-1)}}>Delete Set</button>: <></>}
                </div>
            </div>:<></>}

            <div>
                <label>{'Equivalent Weight In Kg.'}</label>
                <input required defaultValue={exerciseData['weightInKg']} type='number' onChange={e => handleWeightChange(exerciseIndex, dayIndex,e.target.value)}/>
            </div>

            <div>
                <label>{'Rest in Seconds between sets'}</label>
                <input required defaultValue={exerciseData['restInSec']} type='number' onChange={e => handleRestChange(exerciseIndex, dayIndex,e.target.value)}/>
            </div>

            <div>
                <label >{'Rest before next exercise in minutes'}</label>
                <input required defaultValue={exerciseData['restAfterInMins']} type='number' onChange={e => handleRestAfterInMinsChange(exerciseIndex, dayIndex,e.target.value)}/>
            </div>

            <br />

        </fieldset>
    )
}

const Day = ({dayData, handleDataChange, dayIndex, handleAddExercise, handleDeleteExercise, exerciseOptions,dv, handleDayParamsChange}) => {
    
    const [collapsed, setCollapsed] = useState(true)

    return(


        <fieldset style={{
            marginLeft: '30px', 
            position: 'relative',
            height: collapsed?45:'auto',
            overflow: 'hidden',
            paddingTop:15,
            borderBottom: 'solid 1px grey'
            }}>
                
            <label><b>{`Day ${dayData['day']}`}</b></label>
            <div className='hoverable-plain' style={{position: 'absolute', top: 0, right: 50, transform: collapsed?'':'rotate(180deg)' }} onClick={() => {setCollapsed(!collapsed)}} >
                <svg  height="40" viewBox="0 0 24 24" width="40" >
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                </svg>
            </div>


            <div>
                <label>{'Target body part(s) : '}</label>
                <input required defaultValue={dayData['targetBodyPart']} onChange={e => handleDayParamsChange(dayIndex, 'targetBodyPart',e.target.value)} />
            </div>
            <div>
                <label>{'Estimated Time in minutes(s) : '}</label>
                <input required defaultValue={dayData['timeInMins']} type='number' min={0} step="1" onChange={e => handleDayParamsChange(dayIndex, 'timeInMins',e.target.value)} />
            </div>

            <div>
                <label>{'Day Intro video embed string (optional) : '}</label>
                <textarea defaultValue={dayData['dayIntroVideoEmbedString']}  onChange={e => handleDayParamsChange(dayIndex, 'dayIntroVideoEmbedString',e.target.value)} />
            </div>

            {dayData.exercises.map((exerciseData, index)=>{
                return(
                    <Exercise 
                    key={index} 
                    exerciseData={exerciseData} 
                    dayIndex={dayIndex} 
                    exerciseIndex={index} 
                    handleDataChange={handleDataChange}
                    exerciseOptions={exerciseOptions}
                    dv={dv}
                    />
                )
            })}
        
        <div style={{display: 'flex'}}>

        <AddExerciseButton 
            dayIndex={dayIndex}
            handleAddExercise={handleAddExercise}
        />
        &nbsp;
        &nbsp;
        <DeleteExerciseButton 
            dayIndex={dayIndex}
            exercises={dayData.exercises} 
            handleDeleteExercise={handleDeleteExercise}
        />
        </div>
        <br/><br/>
        </fieldset>
        
    )
}

const Schedule = ({setScheduleData, dv}) => {


    const BASE_URL = 'http://localhost:3567/admin'
    const [exerciseOptions, setExerciseOptions] = useState([]) 
    const [isLoading, setIsLoading] = useState(true)
    async function getAllExerciseData()  {
        let res = await axios.get(BASE_URL+`/exercises`)
        let fetchedData = await res.data.response
        return fetchedData
    }
    
    useEffect(() => {
        getAllExerciseData()
        .then(fetchedData => {
            if (fetchedData !== null){
                setIsLoading(false)
                setExerciseOptions(fetchedData)
        }})
        .catch(err => {
            console.log(err);
            toast.error('Failed to fetch Exercise data. Please Reload the Page')
        });
    }, [])
    

    const exerciseShape = {
                exerciseID: '',
                exerciseName: '',
                target: [""],
                weightInKg: '',
                restInSec : '',
                repetitionType: '',
                restAfterInMins: ''
            }
    
    const dayShape = {
        day: 1,
        exercises: [exerciseShape],
    }

    const [schedule, setSchedule] = useState(dv?dv:[dayShape])

    const initializeScheduleData = () => {
        setScheduleData(schedule);
    }

    initializeScheduleData();

    const handleDayParamsChange =(dayIndex, field, value) => {
        const updatedSchedule = [...schedule]
        updatedSchedule[dayIndex][field] = Number(value)?Number(value): value
        setSchedule(updatedSchedule)
        setScheduleData(updatedSchedule)
    }

    const handleDataChange = (dayIndex, exerciseIndex, field, value) => {
        const updatedSchedule = [...schedule]
        updatedSchedule[dayIndex].exercises[exerciseIndex][field] = value 
        setSchedule(updatedSchedule)
        setScheduleData(updatedSchedule)
    }

    const handleAddExercise = (dayIndex) => {
        const updatedSchedule = [...schedule]
        updatedSchedule[dayIndex]['exercises'].push(exerciseShape)
        setSchedule(updatedSchedule)
        setScheduleData(updatedSchedule)
    }

    const handleDeleteExercise = (dayIndex) => {
        const updatedSchedule = [...schedule]
        updatedSchedule[dayIndex]['exercises'].pop()
        setSchedule(updatedSchedule)
        setScheduleData(updatedSchedule)
    }

    const handleAddDay = () => {
        const updatedSchedule = [...schedule]
        let newDayShape = dayShape
        newDayShape.day = schedule.length + 1 
        updatedSchedule.push(newDayShape)
        setSchedule(updatedSchedule)
        setScheduleData(updatedSchedule)
    }

    const handleDeleteDay = () => {
        const updatedSchedule = [...schedule]
        updatedSchedule.pop()
        setSchedule(updatedSchedule)
        setScheduleData(updatedSchedule)
    }
 
    if(!isLoading){ return (
    
        <fieldset>
            {schedule.map((dayData, index) => {     
                return(<Day 
                    key={index} 
                    dayIndex={index} 
                    dayData={dayData} 
                    handleDataChange={handleDataChange}
                    handleAddExercise={handleAddExercise}
                    handleDeleteExercise={handleDeleteExercise}
                    exerciseOptions={exerciseOptions}
                    dv={dv}
                    handleDayParamsChange={handleDayParamsChange}
                    />)
            })}

            <br />
            <br />

            <AddDayButton 
                handleAddDay={handleAddDay}
            />
            &nbsp;
            &nbsp;
            <DeleteDayButton 
                schedule={schedule} 
                handleDeleteDay={handleDeleteDay}
            />
        </fieldset> )
        }else{
            return(<Loader />)
        }
}

export default Schedule;