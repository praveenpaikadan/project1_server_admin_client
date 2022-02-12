
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Player from '../components/videoplayer'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AvatarName from '../components/avatar-name'
import { ExpandMoreIcon } from '@material-ui/icons';

axios.defaults.withCredentials = true

const DisplayItem = (props) => {

    const [collapsed, setCollapsed] = useState(true)
    const styles = {
        container:{
            position:'relative',
            paddingLeft: '20px',
            display: 'flex',
            width:'100%',
            height: props.collapsable?(collapsed?45:'auto'):'auto',
            overflow: 'hidden',
            ...props.style
        },
        label : {
            fontWeight: 'bold',
            marginRight: '10px'
        }
    }

    var label = props.label;
    var value = props.value;

    return(
        <div style={{...styles.container}} className='height-transition'>
            {props.collapsable?
                <div className='hoverable-plain' style={{position: 'absolute', top: 0, right: 50, transform: collapsed?'':'rotate(180deg)' }} onClick={() => {setCollapsed(!collapsed)}} >
                    <svg  height="40" viewBox="0 0 24 24" width="40" >
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                    </svg>
                </div>: 
            null}
            <label style={styles.label}>{label}</label>
            <div >{value}</div>
            <div >{props.children}</div> 
        </div>
    )   
}

const EditButton = ({editHandler, programData}) => {
    return(
        <button onClick={() => editHandler(programData)} style={{display:'flex', justifyContent:'center'}} className="btn btn-warning"><EditIcon/>Edit Item</button>
    )
}

const DeleteButton = ({deleteHandler}) => {
    return(
        <button onClick={() => deleteHandler()} style={{display:'flex', justifyContent:'center'}} className="btn btn-danger"><DeleteIcon />Delete Item</button>
    )
}

const ProgramDisplay = ({programData, BASE_URL, editHandler, deleteHandler}) => {
    
    var data = programData

    const dispData = [
        ['Program Name', 'programName'],
        ['Category', 'category'],
        ['Duration in Weeks', 'durationWeeks'], 
        ['Days per Week', 'daysPerWeek'], 
        ['Level', 'level'],
        ['Goal', 'goal'],
        ['Other Remarks', 'otherRemarks']
    ]
    return ( 

        <div style={{maxWidth:'800px', margin:'auto'}}>

            {dispData.map((item, index) => (
                <DisplayItem 
                label={`${item[0]}:  `}
                value={programData[item[1]]}
                />
                ))}

        
            <DisplayItem
                label={'Equipments: '}
                value={programData.equipments.map(item => `${item}, `)} 
            />
            
            <DisplayItem 
                label={'Program Type: '}
                value={programData.type == false? 'Private': 'Public'}
            />

            {programData.type == false? 
            <DisplayItem
                label={'Private Clients: '}
            >
                {programData.privateClients.map((item, index) => {
                    return(
                        <AvatarName key={index} name={item.name} uri={'uri'} />
                    )
                })}
            </DisplayItem>:<></>
            }

            <DisplayItem 
                label={'Plan Types: '}
                style={{display: 'flex', flexDirection: 'column'}}
            >
                {programData.subscriptionOptions?programData.subscriptionOptions.map((item, index) => (
                    <div key={index}>
                    <DisplayItem key={index+'1'}
                        label={`Plan Type : `} 
                        value={item.planType}    
                    />
                    <DisplayItem key={index+'2'}
                        label={`Description`} 
                        value={item.description}    
                    />
                    <DisplayItem key={index+'3'}
                        label={`Price In INR : `} 
                        value={item.priceInRs}    
                    />
                    <DisplayItem key={index+'4'}
                        label={`Payment reccurence (payment repeat after) : `} 
                        value={item.paymentReccurence?`${item.paymentReccurence} days`:'N/A'}    
                    />
                    <DisplayItem key={index+'5'}
                        label={`Automatically lock user if payment is delayed: `} 
                        value={item.forceLock?'Yes':'No'}    
                    />
                    <br />
                    </div>
                )):<></>}
            </DisplayItem>

            <DisplayItem 
                label={`Program Status : `} 
                value={programData.active?'Active': 'Inactive'}    
            />


            <DisplayItem 
                label={'Schedule: '}
                style={{display: 'flex', flexDirection: 'column'}}
            >
                {programData.schedule.map((day, dayIndex) => {
                    return(
                        <div key={dayIndex}>
                        <DisplayItem
                            label={`Day: ${day.day}`}
                            style={{display: 'flex', flexDirection: 'column',  paddingTop: 8, borderBottom: 'solid 1px grey'}}
                            collapsable={true}
                        >
                            <DisplayItem
                                label={`Total Time in Minutes : `} 
                                value={day.timeInMins}    
                            />
                            <DisplayItem
                                label={`Target Body Parts (s) : `} 
                                value={day.targetBodyPart}    
                            />

                            <DisplayItem
                                label={`Day Intro Video: `} 
                                value={day.dayIntroVideoEmbedString?'':'Not available'}    
                            ></DisplayItem>
                            
                            <div style={{width: '360px', marginLeft: '20px', marginBottom: '20px'}}dangerouslySetInnerHTML={{__html: day.dayIntroVideoEmbedString}} />
                            
                            


                            <DisplayItem>
                                {day.exercises.map((item, index) => (
                                    <>
                                    <DisplayItem key={index+'_0'}
                                        label={`Exercise Number : `} 
                                        value={index+1}    
                                    />

                                    <DisplayItem key={index+'_1'}
                                        label={`Exercise Name : `} 
                                        value={item.exerciseName}    
                                    />
                                    <DisplayItem key={index+'_2'}
                                        label={`Target Sets : `} 
                                        value={`${item.target.join(', ')} ${item.repetitionType}`}    
                                    />
                                    <DisplayItem key={index+'_3'}
                                        label={`Equivalent weight In Kg : `} 
                                        value={item.weightInKg}    
                                    />
                                    <DisplayItem key={index+'_4'}
                                        label={`Rest between sets in Seconds : `} 
                                        value={item.restInSec}    
                                    />
                                    <DisplayItem key={index+'_5'}
                                        label={`Rest Before next exercise in minutes : `} 
                                        value={item.restAfterInMins}    
                                    />
                                    
                                    <br />
                                    </>         
                                ))}
                            </DisplayItem>
                        </DisplayItem>
                        <br />
                        </div>
                    )
                })}
            </DisplayItem>

            

            <br />
            <DisplayItem label={'Cover Image: '}/>      

            { programData.imageUrl?
                <img style={{margin: '20px', maxWidth: '300px', maxHeight: '200px'}} src={programData.imageUrl}></img>

                :

                <div style={{display:'flex', flex:1, flexWrap: 'wrap',marginLeft: '40px'}}>
                    {programData.images?programData.images.map((image, index) => {
                        let src = BASE_URL+'/media/'+image.filename
                        return(<img style={{margin: '10px'}} src={src} height='200px'></img>)
                    }):<></>}
                </div>            
            }
            
            <br />

            <DisplayItem 
            label={'Program Video: '}
            value={programData.videoEmbedString?'':'Not available'}
            > 
            </DisplayItem> 
            <div style={{maxWidth: '360px',marginLeft: '20px', marginBottom: '20px'}} dangerouslySetInnerHTML={{__html: programData.videoEmbedString}} />



            
            
            {/**Video from server*/}
            {/* {programData.videos?programData.videos.map((video, index) => {
                let src = BASE_URL+'/media/'+video.filename
                return(<Player key={index}src={src} style={{maxWidth: '620px', marginLeft: '50px'}}/>)
            }):<></>} */}
        
            <br />
            <div style={{display: 'flex'}}>
                <EditButton 
                    editHandler={editHandler} 
                    programData={programData}/>
                &nbsp;&nbsp;
                <DeleteButton 
                    deleteHandler={deleteHandler}
                />
            </div>
        </div>
  );
}

export default ProgramDisplay