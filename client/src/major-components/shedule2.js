import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Loader from '../components/loader';
import { DriveVideoWrapperCopyButton } from '../components/copy-wrapper-button';
import { Autocomplete } from '@mui/material';
import { TextField } from '@material-ui/core';
import { getAllProgramData, getProgramDataByID } from '../fetch-handlers/programs';
import { BASE_URL } from '../App';

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

const Exercise = ({exerciseData, exerciseIndex, dayIndex, handleDataChange, exerciseOptions}) => {

    const [selectedExerciseId, setSelectedExerciseId] = useState(exerciseData['exerciseID']?exerciseData['exerciseID']:false)
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
                <select onChange={e => handleExerciseOptionChange( exerciseIndex, dayIndex, e.target.value)}>
                    <option></option>
                    {exerciseOptions.map((option, index) => {
                        var dfv = false
                        try{dfv = exerciseData.exerciseName===option.exerciseName}
                        catch(err){}
                        return(
                        <option key={index} selected={dfv} value={option['_id']}>{option['exerciseName']}</option>    
                    )})}
                </select>
            </div>


            {selectedExerciseId? <div>
            
                {target.map((item, i)=>(
                <div>
                    <label>{`Set ${i+1} Target: `}</label>
                    <input  defaultValue={item} onChange={e => handleTargetChange(exerciseIndex, dayIndex,e.target.value, i)}/>
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
                <input  defaultValue={exerciseData['weightInKg']} type='number' onChange={e => handleWeightChange(exerciseIndex, dayIndex,e.target.value)}/>
            </div>

            <div>
                <label>{'Rest in Seconds between sets'}</label>
                <input  defaultValue={exerciseData['restInSec']} type='number' onChange={e => handleRestChange(exerciseIndex, dayIndex,e.target.value)}/>
            </div>

            <div>
                <label >{'Rest before next exercise in minutes'}</label>
                <input  defaultValue={exerciseData['restAfterInMins']} type='number' onChange={e => handleRestAfterInMinsChange(exerciseIndex, dayIndex,e.target.value)}/>
            </div>

            <br />

        </fieldset>
    )
}

const Day = ({ forceRender, dayData, handleDataChange, dayIndex, handleAddExercise, handleDeleteExercise, exerciseOptions, handleDayParamsChange}) => {
    
    const [dayIntroVideoEmbedString, setDayIntroVideoEmbedString ] = useState(dayData.dayIntroVideoEmbedString)

    useState(() => {

    }, [forceRender])

    return(
        <fieldset style={{
            marginLeft: '30px', 
            position: 'relative',
            overflow: 'hidden',
            paddingTop:15,
            borderBottom: 'solid 1px grey'
            }}>
                
            <label><b>{`Day ${dayIndex + 1}`}</b></label>

            <div>
                <label>{'Target body part(s) : '}</label>
                <input defaultValue={dayData['targetBodyPart']} onChange={e => handleDayParamsChange(dayIndex, 'targetBodyPart',e.target.value)} />
            </div>
            <div>
                <label>{'Estimated Time in minutes(s) : '}</label>
                <input defaultValue={dayData['timeInMins']} type='number' min={0} step="1" onChange={e => handleDayParamsChange(dayIndex, 'timeInMins',e.target.value)} />
            </div>

            <div>
                <div>
                <label>{'Day Intro video embed string (optional) : '}</label>
                <DriveVideoWrapperCopyButton style={{marginLeft: 'auto'}}/>
                </div>
                <textarea 
                onBlur={e => setDayIntroVideoEmbedString(e.target.value)}
                defaultValue={dayData['dayIntroVideoEmbedString']}  onChange={e => handleDayParamsChange(dayIndex, 'dayIntroVideoEmbedString',e.target.value)} />
            </div>

            <div style={{width: '100%'}}>
                {dayData['dayIntroVideoEmbedString'] !== ''?<div style={{width: '360px', marginTop:'10px', marginBottom: '30px'}}dangerouslySetInnerHTML={{__html:dayData['dayIntroVideoEmbedString']}} />: null}
            </div>

            <div>
                <label>{'Exercises : '}</label>
            </div>

            {dayData.exercises.map((exerciseData, index)=>{
                return(
                    <Exercise 
                        key={exerciseData._id || exerciseData.key} 
                        exerciseData={exerciseData} 
                        dayIndex={dayIndex} 
                        exerciseIndex={index} 
                        handleDataChange={handleDataChange}
                        exerciseOptions={exerciseOptions}
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


const Schedule2 = ({setScheduleData, dv, scheduleRetreiver, exportSchedule}) => {


    useEffect(() => {
        if(scheduleRetreiver){
            exportSchedule(schedule.current)
        }
    })

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

    
    

    const exerciseShape = () => {
        return({
                exerciseID: '',
                exerciseName: '',
                target: [""],
                weightInKg: '',
                restInSec : '',
                repetitionType: '',
                restAfterInMins: '',
                key:String(Math.random()*(10^16))
            })}
    
    const dayShape = () => {return ({
        targetBodyPart: '',
        timeInMins: '',
        dayIntroVideoEmbedString: '',
        exercises: [exerciseShape()], 
        key:String(Math.random()*(10^16))
    })}

    if(!dv){
        dv = [dayShape()]
    }

    const schedule = useRef(dv)

    const setSchedule = (val) => {
        schedule.current = val
    }

    const [activeDayIndex, setActiveDayIndex] = useState(0)
    const [activeDayData, setActiveDayData] = useState(schedule.current[0])

    const [forceRender, setForceRender] = useState(false)

    const getScheduleLengthArray = () => {
        return schedule.current.map((item, index) => {return({dayIndex: index, key: item.key})})
    }

    const [scheduleLength, setScheduleLength] = useState(getScheduleLengthArray())

    const handleDayParamsChange =(dayIndex, field, value) => {
        var updatedSchedule = schedule.current
        updatedSchedule[dayIndex][field] = Number(value)?Number(value): value
        setSchedule(updatedSchedule)
    }

    const handleDataChange = (dayIndex, exerciseIndex, field, value) => {
        var updatedSchedule = schedule.current
        updatedSchedule[dayIndex].exercises[exerciseIndex][field] = value 
        setSchedule(updatedSchedule)
        setActiveDayData(updatedSchedule[dayIndex])
    }

    const handleAddExercise = (dayIndex) => {
        var updatedSchedule = schedule.current
        updatedSchedule[dayIndex]['exercises'].push(exerciseShape())
        setSchedule(updatedSchedule)
        setActiveDayData(updatedSchedule[dayIndex])
        setForceRender(!forceRender)
    }

    const handleDeleteExercise = (dayIndex) => {
        var updatedSchedule = schedule.current
        updatedSchedule[dayIndex]['exercises'].pop()
        setSchedule(updatedSchedule)
        setActiveDayData(updatedSchedule[dayIndex])
        setForceRender(!forceRender)

    }

    const handleDayChange = (dayIndex) => {
        setActiveDayIndex(dayIndex)
        setActiveDayData(schedule.current[dayIndex])
    }

    const handleAddRemoveDay = (index, add) => {
        if(add){
            schedule.current.splice(index+1,0,dayShape())
        }else{
            schedule.current.splice(index,1)
        }
        setScheduleLength(getScheduleLengthArray())
    }

    // copy schedule section

    const [search, setSearch] = useState("")
    const [programList, setProgramList] = useState(null)
    const [selectedProgramID, setSelectedProgramID] = useState(null)

    const copySchedule = () => {
        if(! selectedProgramID){
            toast.error('No program selected.')
            return
        }
        

        var ok = window.confirm("Do you want to copy schedule from another program? This will overwrite the existing schedule. It is reccomended to save before copying.")
        if(ok){
            setIsLoading(true)
            getProgramDataByID(selectedProgramID)
            .then(fetchedData => {
                if (fetchedData !== null && fetchedData.schedule[0]){
                    setSchedule(fetchedData.schedule)
                    setActiveDayData(fetchedData.schedule[0])
                    setActiveDayIndex(0)   
                    setScheduleLength(getScheduleLengthArray())
                }
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false)
                toast.error('Failed to fetch schedule. Please try again.')
            });
        }
    }

    useEffect(() => {
        getAllProgramData()
        .then(fetchedData => {
            if (fetchedData !== null){
                fetchedData = fetchedData.map((item) => {item.keyWords = item.keyWords + item.programName; return item}) 
                setProgramList(fetchedData)
        }})
        .catch(err => {
            console.log(err);
            toast.error('Failed to fetch program list. Please Reload the Page')
        });
    }, [])

    // ==================================
 
    if(!isLoading){ 
        return (
            <div>
                {programList?
                <div style={{display: 'flex', flexDirection: 'row', alignItems:'flex-end', marginBottom: '20px'}}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    onChange={(e, v) => {setSelectedProgramID(v && v.id ?v.id: null)}}
                    id="combo-box-demo"
                    options={programList.map((item) => {return({label: `${item.programName} (${item.active? "Active":"Inactive"})`, id: item._id})})}
                    sx={{margin: '8px', width: '300px'}}
                    renderInput={(params) => <TextField value={search} onChange={(e) => {setSearch(e.target.value)}} {...params} label={`Copy from other programs`} />}
                />
                <button class="btn btn-primary" style={{marginRight: '10px', marginLeft: '10px'}} onClick={(e) => {e.preventDefault(); copySchedule()}}>{'Copy'}</button>
                </div>:
                null}
                <div style={{maxHeight: '200px', overflowY: 'scroll', width: '350px'}}>
                {scheduleLength.map((item, index) => {
                    return(
                        <div style={{display: 'flex', flexDirection: 'row', margin: '5px'}} key={item.key}>
                        <button class="btn" style={{width: '70px'}} onClick={(e) => {e.preventDefault();handleDayChange(index)}}>{'Day '+(index + 1) }</button>
                        <button class="btn btn-success" style={{marginRight: '10px', marginLeft: '10px'}} onClick={(e) => {e.preventDefault();handleAddRemoveDay(index, true)}}>{'Add day'}</button>
                        {scheduleLength.length>1?<button class="btn btn-danger" onClick={(e) => {e.preventDefault();handleAddRemoveDay(index, false)}}>{'Remove Day'}</button>:null}
                        </div>
                        )
                    })}
                </div>

                <fieldset>
                    <Day 
                        forceRender={forceRender}   // for some reason day componet is not rerendering on addition or deletion so to force render it
                        key={activeDayData.key || activeDayData._id}
                        dayIndex={activeDayIndex} 
                        dayData={activeDayData}  
                        handleDataChange={handleDataChange}
                        handleAddExercise={handleAddExercise}
                        handleDeleteExercise={handleDeleteExercise}
                        exerciseOptions={exerciseOptions}
                        handleDayParamsChange={handleDayParamsChange}
                        />
                </fieldset> 
            </div>
            
            )
        }else{
            return(<Loader />)
        }
}

export default Schedule2;