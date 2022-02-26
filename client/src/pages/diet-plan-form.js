import { Avatar, TextField } from '@material-ui/core';
import av from '../assets/profile.jpg'
import ListPage from './list-page'
import { getAllProgramData } from '../fetch-handlers/programs';
import { useState, useEffect, useRef } from 'react';
import { getAllExerciseData } from '../fetch-handlers/exercise';
import { ImageUpload } from '../components/image-upload';
import { BASE_URL } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/loader';
import MultiSelectClientList from '../major-components/client-select';
import { arrayRange, convDecimalTime } from '../utilities/helpers';
import { useParams, useHistory, useRouteMatch } from 'react-router';
import { getAllDietPlanData, getDietPlanData } from '../fetch-handlers/diet-plan';
import {Progress} from 'reactstrap';
import { Autocomplete } from '@mui/material';

const AddIcon = ({style}) => (<svg style={{...style, transform: 'translateY(5px)'}} height="24px" viewBox="0 0 24 24" width="24px" fill="green"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>) 
const RemoveIcon = ({style}) => (<svg style={{...style, transform: 'translateY(5px)'}} height="24px" viewBox="0 0 24 24" width="24px" fill="red"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>)

const contentItemShape = () => {
    return({content: '', key:String(Math.random()*(10^16))})
}

const targetItemShape = () => {
    return ({param: '',min: 0, max: 0, unit: "", key:String(Math.random()*(10^16))})
}

const planItemShape = () => {
    return({title: '', time: 0, contents: [contentItemShape()], key:String(Math.random()*(10^16))})
}

const dayDietShape = () =>  {
    return {
    day: 0, 
    target: [targetItemShape()], 
    plan:[planItemShape()],
    key:String(Math.random()*(10^16))}
}

const clientShape = () => {
    return ({userID: '', userName: '', email: '', programID: '', programName: ''})
}

const DayDiet = ({_dayDiet, dayIndex, setDayData, setActiveDayIndex}) => {
    
    const targetParams = ['Calories', 'Protein', 'Carbs', 'Fat']
    const targetUnits = ['kCal', 'gram', 'gram', 'gram']
    const dietTitles = ['Wake Up', 'Morning Snack', 'Breakfast', 'Lunch', 'Pre workout', 'After workout', 'Dinner', 'Before Sleep']
    const [collapsed, setCollapsed] = useState(false)
    const [dayDiet, setDayDiet] = useState(_dayDiet)

    useEffect(() => {setDayDiet(_dayDiet)}, [dayIndex])

    const handleTargetChange = (index, field, value) => {  // field = 0,1,2 => param, min , max

        var fields = ['param', 'min', 'max']
        var oldDayDiet = {...dayDiet}
        var fieldName = fields[field]
        oldDayDiet.target[index][fieldName] = value

        if(field == 0){
            oldDayDiet.target[index].unit = targetUnits[targetParams.indexOf(value)]
        }
        
        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return
    }

    const handleAddTarget = (index) => {
     
        var oldDayDiet = {...dayDiet}

        oldDayDiet.target.splice(index+1,0, targetItemShape())

        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return
    }

    const handleDeleteTarget = (index) => {
        var oldDayDiet = {...dayDiet}
        oldDayDiet.target.splice(index, 1)
        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return
    }

    const handleAddPlanItem = (index) => {
        var oldDayDiet = {...dayDiet}
        oldDayDiet.plan.splice(index+1,0, planItemShape())
        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return
    }

    const handleDeletePlanItem = (index) => {
        var oldDayDiet = {...dayDiet}
        oldDayDiet.plan.splice(index, 1)
        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return
    }

    const handleTitleChange = (planItemIndex, value) => {
        var oldDayDiet = {...dayDiet}
        oldDayDiet.plan[planItemIndex].title = value
        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return
    }

    const handleTimeChange = (planItemIndex, hrOrMin,  value) => {     // hrOrMin = 0 for hr, 1 for min
        var oldDayDiet = {...dayDiet}
        let currTime = oldDayDiet.plan[planItemIndex].time
        let currHour = Math.floor(currTime)
        let currMin = currTime - currHour 
        let newHour = hrOrMin === 0? Number(value): currHour
        let newMin = hrOrMin === 1? Number(value)/60: currMin
        oldDayDiet.plan[planItemIndex].time = newHour+newMin
        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return

    }

    const handleAddContent = (planItemIndex, contentIndex) => {
        var oldDayDiet = {...dayDiet}
        oldDayDiet.plan[planItemIndex].contents.splice(contentIndex+1,0,contentItemShape())
        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return
    }

    const handleDeleteContent = (planItemIndex, contentIndex) => {
        var oldDayDiet = {...dayDiet}
        oldDayDiet.plan[planItemIndex].contents.splice(contentIndex, 1)

        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return
    }

    const handleContentChange = (planItemIndex, contentIndex, value) => {
        var oldDayDiet = {...dayDiet}
        oldDayDiet.plan[planItemIndex].contents[contentIndex].content = value
        setDayDiet(oldDayDiet)
        setDayData(dayIndex, oldDayDiet)
        return
    }


    return(

        <fieldset style={{
            marginLeft: '30px', 
            position: 'relative',
            width: '95%',
            height: collapsed?'45px':'auto',
            overflow: 'hidden',
            paddingTop:15,
            borderBottom: 'solid 1px grey',
            paddingBottom: '20px',
            }}>
                
            <label><b>{`Day ${dayIndex + 1}`}</b></label>

            <div className='hoverable-plain' style={{position: 'absolute', top: 0, right: 50, transform: collapsed?'':'rotate(180deg)'  }} onClick={()=> {setCollapsed(!collapsed)}}>
                <svg  height="40" viewBox="0 0 24 24" width="40" >
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                </svg>
            </div>

 
            <div>
                <div>       {/* Target value Section */}
                    <fieldset style={{border: '1px solid rgba(0,0,0,0.2)', borderRadius: '5px', padding: '10px'}}>
                        <label style={{marginLeft: '10px', fontWeight: 500}}>Targetted Intakes</label>
                        <div>
                            <label style={{width: '100px', marginLeft:'30px'}}>Parameter</label>
                            <label style={{width: '80px', marginLeft:'30px'}}>Min Value</label>
                            <label style={{width: '80px', marginLeft:'30px'}}>Max Value</label>
                            <label style={{width: '50px', marginLeft:'30px'}}>Unit</label>
                            {dayDiet.target.length == 0?<div style={{display:'inline',  marginLeft:'10px'}} onClick ={() => handleAddTarget(0)}><AddIcon /></div>:null}
                        </div>
                        <div>                        
                            {dayDiet.target.map((targetItem, targetItemIndex) => {
                                return(
                                    <div key = {targetItem._id || targetItem.key}>
                                        <select value={targetItem.param} onChange={(e) => {handleTargetChange(targetItemIndex, 0, e.target.value)}}
                                            style={{width: '100px', marginLeft:'30px'}}>
                                                <option>{}</option>
                                                {targetParams.map((param, _index) => <option value={param} key={_index}>{param}</option>)}
                                        </select>
                                        
                                        <input style={{width: '80px', marginLeft:'30px'}} type='number' min='0'  value={Number(targetItem.min)} onChange={(e) => {handleTargetChange(targetItemIndex, 1,  Number(e.target.value))}}></input>
                                        <input style={{width: '80px', marginLeft:'30px'}} type='number' min='0'  value={Number(targetItem.max)} onChange={(e) => {handleTargetChange(targetItemIndex, 2,  Number(e.target.value))}}></input>
                                        <label style={{width: '50px', marginLeft:'30px'}}>{targetItem.unit?targetItem.unit:''}</label>
                                        <div style={{display:'inline',  marginLeft:'10px'}} onClick ={() => handleAddTarget(targetItemIndex)}>
                                            <AddIcon   />
                                        </div>
                                        <div style={{display:'inline',  marginLeft:'10px'}} onClick ={() => handleDeleteTarget(targetItemIndex)}>
                                            <RemoveIcon />
                                        </div>
                                    </div>            
                                )
                            })}
                        </div>
                    </fieldset>
                </div>

                <div>                                               {/* Plan Section*/ }
                    <fieldset style={{border: '1px solid rgba(0,0,0,0.2)', borderRadius: '5px', padding: '10px', marginTop: '10px'}}>
                    <label style={{marginLeft: '10px', fontWeight: 500}}>Plan</label>
                        {dayDiet.plan.length == 0?<div style={{display:'inline',  marginLeft:'10px'}} onClick ={() => handleAddPlanItem(0)}><AddIcon /></div>:null}

                    {dayDiet.plan.map((planItem, index) => {
                        return(
                        <div key={planItem._id || planItem.key} style={{marginBottom: '20px'}}>
                            <fieldset style={{border: '1px solid rgba(0,0,0,0.2)', borderRadius: '5px', padding: '10px', paddingLeft: 0}}>
                                <div> 

                                    <div>
                                        <label style={{width: '250px', marginLeft:'30px'}}>Title</label>
                                        <label style={{marginLeft:'10px'}}>{`Time (${convDecimalTime(planItem.time)})`}</label>
                                    </div>

                                    <div>
                                        <select onChange={(e) => {handleTitleChange(index, e.target.value)}}
                                            style={{width: '250px', marginLeft:'30px'}}>
                                                <option>{}</option>
                                                {dietTitles.map((title, _index) => <option selected={planItem.title === title} key={_index}>{title}</option>)}
                                        </select>
                                        <select onChange={(e) => {handleTimeChange(index, 0, e.target.value)}}
                                            style={{width: '50px', marginLeft:'10px'}}>
                                                <option>{}</option>
                                                {arrayRange(0, 24, 1).map((hr, _index) => <option selected={ typeof(planItem.time) === 'number' && Math.floor(planItem.time) === hr} key={_index}>{hr}</option>)}
                                        </select>
                                        <label>hr</label>
                                        <select onChange={(e) => {handleTimeChange(index, 1, e.target.value)}}
                                            style={{width: '50px', marginLeft:'10px'}}>
                                                <option>{}</option>
                                                {arrayRange(0, 60, 15).map((min, _index) => <option selected={ typeof(planItem.time) === 'number' && (planItem.time - Math.floor(planItem.time)) === min} key={_index}>{min}</option>)}
                                        </select>
                                        <label>min</label>
                                    </div>

                                    <div style={{ marginLeft:'30px'}}>  {/*content section */}
                                        <label style={{marginLeft:'30px'}}>Contents</label>
                                        {planItem.contents.length === 0?<div style={{display:'inline',  marginLeft:'10px'}} onClick ={() => handleAddContent(index, 0)}><AddIcon /></div>:null} 
                                        {planItem.contents.map((contentItem, contentIndex) => {
                                            return(                                            
                                                <div style={{marginLeft:'30px'}} key={contentItem._id || contentItem.key}>
                                                    <div>
                                                        <input value={contentItem.content} style={{width:'80%'}} onChange={(e) => {handleContentChange(index, contentIndex, e.target.value)}}></input>
                                                        <div style={{display:'inline',  marginLeft:'10px'}} onClick ={() => {handleAddContent(index, contentIndex)}}>
                                                            <AddIcon   />
                                                        </div>
                                                        <div style={{display:'inline',  marginLeft:'10px'}} onClick ={() => {handleDeleteContent(index, contentIndex)}}>
                                                            <RemoveIcon />
                                                        </div>
                                                    </div>
                                                </div> 
                                            )
                                        }) }
                                    </div>

                                    <div style={{ marginLeft:'30px', marginTop: '20px'}}>
                                        <button class = 'btn btn-success  btn-sm' style={{display:'inline', marginRight: '10px'}} onClick ={() => {handleAddPlanItem(index)}}>
                                            Add New title below
                                        </button>
                                        <button class = 'btn btn-danger btn-sm' style={{display:'inline'}} onClick ={() => {handleDeletePlanItem(index)}}>
                                            Remove this title
                                        </button>
                                    </div>
                                </div>
                            </fieldset>
                        </div>)})}
                    </fieldset>
                </div>
            </div>
        </fieldset>
    )
}


function DietPlanForm({id}){

    const [progress, setProgress] = useState(0) // Prgress bar 

    const data = useRef(
        {
            planName: '',
            keyWords: '',
            description: '',
            water: 0,
            client: clientShape(),   // [{userID: 'svavv' , userName: '',  programID: '', email} ....] 
            dietPlan: [dayDietShape()],
            active: false,
        })

    const getPlanLengthArray = () => {
        return data.current.dietPlan.map((item, index) => {return({dayIndex: index, key: item.key})})
    }


    const [active, setActive] = useState(false)
    const [error, setError] = useState('')
    const [client, setClient] = useState(data.current.client?data.current.client:clientShape())
    const [programList, setProgramList] = useState([])
    const [programsLoading, setProgramsLoading] = useState('')
    const [planLength, setPlanLength] = useState(getPlanLengthArray())
    
    const getGenData = () => {            
        let _genData = {}
        for(let i in data.current){
            if(i !== 'dietPlan' || i !=='client'){
                _genData[i] = data.current[i]
            }
        }
        return _genData
    }

    const getActiveDayData = (dayIndex) => {
        return data.current.dietPlan[dayIndex]
    }

    const [activeDayData, setActiveDayData] = useState(getActiveDayData(0))
    const [genData, setGenData] = useState(getGenData())                               // for storing data other than dietPlan in state
    const [activeDayIndex, setActiveDayIndex] = useState(0)
 
    const setData = (value) => {
        data.current = value
        setGenData(getGenData())
        setActiveDayData(getActiveDayData(activeDayIndex))
    }

    const _setClients = (value) => {   // alue = array of clients [] , here only one element or no element

        if(!value[0]){
            setClient(clientShape()) 
            return
        }
        var client = value.map((item) => {return {userID: item.userID, userName: item.name, email: item.email, programID: item.programID?item.programID:'', programName: item.programName?item.programName:''}})[0]
        
        if(client === undefined){
            setClient(clientShape()); 
            setProgramList([]); 
            return
        }

        setClient(client) 
        setProgramsLoading('(Please wait while Loading ...)')
        axios.get(BASE_URL + '/clients/assigned-programs/'+client.userID)
        .then((response) => {
           try{ 
               if(response.data[0]  === undefined){
                setProgramsLoading('(No Programs are assigned to this user...)')
                }else{
                    setProgramList(response.data)
                    setProgramsLoading(`(Select among ${response.data.length} programs assigned to this user)`)
                }
            }catch{
                setProgramsLoading('(Error While Loading... Please try again)')
            }
            })
        .catch(() => {setProgramsLoading('(Error While Loading... Please try again)')})
    }

    const [loading, setLoading] = useState(false)
    useEffect(() => {

        if(id){
            setLoading(true)
            getDietPlanData(id)
            .then((response) => {
                setData(response)
                setPlanLength(getPlanLengthArray())
                if(response.client.userID){
                    _setClients([response.client])
                }
                setLoading(false)
            })
            .catch((error) => {

            })
        }else{
            setActive(true)
        }
    }, [id])

    const handleChange = (field, value) => {
        var oldData = data.current
        oldData[field] = value
        setData(oldData)
    }

    const handleProgramChange = (value) => {
        if(value === ''){
            setClient({...client, programName: '', programID:''})
            return
        }
        var oldClient = {...client}

        oldClient.programID = value
        oldClient.programName = programList.find((item) => item._id === value).programName
        setClient(oldClient)
    }

    const handleAddRemoveDay = (index, add) => {     //add = true => add , add= false => remove
        if(add){
            data.current.dietPlan.splice(index+1,0,dayDietShape())
        }else{
            data.current.dietPlan.splice(index,1)
        }
        setPlanLength(getPlanLengthArray())
        setData(data.current)
        return
    }

    const handleDayChange = (index) => {
        setActiveDayIndex(index)
        setActiveDayData(getActiveDayData(index))
    } 

    const setDayData = (index, value) => {
        var oldData = data.current
        oldData.dietPlan[index] = value
        setData(oldData)
        return
    }

      // copy schedule section

      const [isLoading, setIsLoading] = useState(false)
      const [search, setSearch] = useState("")
      const [dietPlanList, setDietPlanList] = useState(null)
      const [selectedDietPlanID, setSelectedDietPlanID] = useState(null)
  
      const copySchedule = () => {
          if(! selectedDietPlanID){
              toast.error('No diet plan selected.')
              return
          }
          
          var ok = window.confirm("Do you want to copy plan from another diet plan? This will overwrite the existing data. It is reccomended to save before copying")
          if(ok){
              setIsLoading(true)
              getDietPlanData(selectedDietPlanID)
              .then(fetchedData => {
                  if (fetchedData !== null && fetchedData.dietPlan[0]){
                    var oldData = data.current
                    oldData.dietPlan = fetchedData.dietPlan
                    setData(oldData)
                    handleDayChange(0)
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
          getAllDietPlanData()
          .then(fetchedData => {
              if (fetchedData !== null){
                  setDietPlanList(fetchedData)
          }})
          .catch(err => {
              console.log(err);
              toast.error('Failed to fetch diet plan list. Please Reload the Page')
          });
      }, [])
  
      // ==================================

    const handleSubmit = async (data) => {

        data.client = client

        if(!active){           // edit save toggle
            setActive(true)
            return
        }
        setError('')
        var req = ['planName', 'description']
        for(var field of req){
            if(!data[field]){
                setError('Required '+field)
                return
            }
        }

        for(let i=0; i < data.dietPlan.length ; i++){
            data.dietPlan[i].day = i+1
        }

        console.log(data.dietPlan)

        setActive(false)
        if(data._id){
            setProgress(0)
            axios.patch(BASE_URL +  '/diet-plan', data,
                {
                    onUploadProgress: ProgressEvent => {
                        setProgress((ProgressEvent.loaded / ProgressEvent.total*100),
                    )}  
                })
                .then(res => { 
                    setActive(true) 
                    toast.success('Changes saved successfully. You can continue editing or go back.')
                })
                .catch(err => {
                    setActive(true) 
                    console.log(err)
                    toast.error('Failed to update. Please try again')
                    setProgress(0)
                })
            return
        }
            
        setProgress(0)
        axios.post(BASE_URL +  '/diet-plan', data,
            {
                onUploadProgress: ProgressEvent => {
                    setProgress((ProgressEvent.loaded / ProgressEvent.total*100),
                )}  
            })
            .then(res => { 
                if(res.data._id){
                    setActive(true) 
                    setData(res.data)
                }
                toast.success('Added new Diet Plan. You can continue edit or go back.')
            })
            .catch(err => {
                setActive(true) 
                console.log(err)
                toast.error('Failed to add new Diet Plan. Please try again')
                setProgress(0)
            })
    }
    
    if(loading){
        return <Loader position='center'/>
    }

    return(
        <div>
        <fieldset disabled={!active} className='form' >   
            <div>
                <label>Diet Plan Name</label>
                <input required name={'planName'} value={genData.planName} onChange={(e) => {handleChange('planName', e.target.value)}}/>
            </div>

            <div>
                <label>Key Words</label>
                <input required name={'keyWords'} value={genData.keyWords} onChange={(e) => {handleChange('keyWords', e.target.value)}}/>
            </div>

            <div>
                <label>Identifier description</label>
                <input required name={'description'} value={genData.description} onChange={(e) => {handleChange('description', e.target.value)}}/>
            </div>
            <div>
                <MultiSelectClientList single={true} label={'Clients'} setPrivateClients={_setClients} dv={genData.client['userID']?[{...genData.client, name: genData.client['userName']}]:null}/>
            </div>

            <div>
                <label>Daily Water Consumption (In no. of glasses of 250ml). </label>
                <input required type='number' min={0} name={'water'} value={genData.water} onChange={(e) => {handleChange('water', e.target.value)}}/>
            </div>

            {client['userID'] === ''?<></>:
            <div>
                <lable>Select Program {programsLoading}</lable>
                <select required value={client.programID?client.programID:''} onChange={(e) => {handleProgramChange(e.target.value)}}>
                    <option value={null}></option>
                    {programList.map((item, index) => <option value={item._id}>{`${item.programName} ${item.active?' (Active)':' (Inactive)'}`}</option>)}
                </select>
            </div>}

            <div>
                <label>Diet Plan</label>

                {dietPlanList?
                <div style={{display: 'flex', flexDirection: 'row', alignItems:'flex-end', marginBottom: '20px'}}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    onChange={(e, v) => {setSelectedDietPlanID(v && v.id ?v.id: null)}}
                    id="combo-box-demo"
                    options={dietPlanList.map((item) => {return({label: `${item.planName} (${item.active? "Active":"Inactive"})`, id: item._id})})}
                    sx={{margin: '8px', width: '300px'}}
                    renderInput={(params) => <TextField value={search} onChange={(e) => {setSearch(e.target.value)}} {...params} label={`Copy from other diet plans`} />}
                />
                <button class="btn btn-primary" style={{marginRight: '10px', marginLeft: '10px'}} onClick={(e) => {e.preventDefault(); copySchedule()}}>{'Copy'}</button>
                </div>:
                null}

                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <div style={{maxHeight: '200px', overflowY: 'scroll', width: '350px'}}>
                    {planLength.length === 0? <button class="btn btn-success" style={{marginRight: '10px', marginLeft: '10px'}} onClick={() => {handleAddRemoveDay(0, true)}}>{'Add day'}</button>: null}
                    {planLength.map((item) => {
                        return(
                            <div style={{display: 'flex', flexDirection: 'row', margin: '5px'}} key={item.key}>
                            <button class="btn" style={{width: '70px'}} onClick={() => {handleDayChange(item.dayIndex)}}>{'Day '+(item.dayIndex + 1) }</button>
                            <button class="btn btn-success" style={{marginRight: '10px', marginLeft: '10px'}} onClick={() => {handleAddRemoveDay(item.dayIndex, true)}}>{'Add day'}</button>
                            <button class="btn btn-danger" onClick={() => {handleAddRemoveDay(item.dayIndex, false)}}>{'Remove Day'}</button>
                            </div>
                            )
                    })}
                    </div>
                    <div style={{height: '100%',display: 'flex', flex:1, flexDirection: 'column'}}>
                        <label style={{marginLeft: '30px', fontSize: '18px', opacity: 0.3}}><span role="img">🢀</span> {'Select Day from here to edit'}</label>
                        <label style={{marginLeft: '30px', fontSize: '18px', opacity: 0.3}}><span role="img">✚</span> {'Select Add day to add a day after'}</label>
                        <label style={{marginLeft: '30px', fontSize: '18px', opacity: 0.3}}><span role="img">✘</span> {'Select Remove Day to delete day'}</label>
                    </div>
                </div>

                {!isLoading?
                (planLength.length !== 0? <DayDiet _dayDiet={activeDayData} dayIndex={activeDayIndex} setDayData={setDayData} />:null):
                <Loader /> }
                
            </div>

            <div>
                <label>Active</label>
                <select required name={'active'} value={genData.active} onChange={(e) => {handleChange('active', e.target.value)}}>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                </select>
            </div>

            {error?<p style={{margin: 'auto', color:'red', marginBottom: 10}} >{error}</p>:null}
        </fieldset>
        <Progress max="100" color="success" value={progress} style={{width: '85%', margin: 'auto',marginTop: '5px'}}>{Math.round(progress,2) }%</Progress>
         <div style={{height: '5px', width: '100%'}}></div>           
        <button style={{margin: 'auto', maxWidth: 200}} onClick={() => {handleSubmit(data.current)}} type="submit" class="btn btn-success btn-block">{active?'Save':'Edit'}</button> 
         
         </div>
    )
}

function DietPlanFormPage() {

    const {id} = useParams()
    const history = useHistory()
    const {path, url} = useRouteMatch()

  return (
    <div className='main'>
    <div className='container'>
        <div className='wrapperContainer'>
            <div className='unScrollableContainer'>
                <div className='mainName'>Diet Plan</div>
            </div>

            <div className='scrollableContainer'>
                <DietPlanForm id={id}/>

                {/* footer */}
                <div style={{backgrondColor: 'yellow', width: '100%', height: 150}}></div>
            </div>
        </div>
    </div>

    <div className='rightContainer'>
        
    </div>
</div>   
  );
}

export default DietPlanFormPage;
