
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Player from '../components/videoplayer'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

axios.defaults.withCredentials = true

const DisplayItem = (props) => {
    const styles = {
        container:{
            paddingLeft: '20px',
            display: 'flex',
            width:'100%',
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
        <div style={styles.container}>
            <label style={styles.label}>{label}</label>
            <div >{value}</div>
            <div >{props.children}</div> 
        </div>
    )   
}

const EditButton = ({editHandler, exerciseData}) => {
    
    console.log('edit')
    return(
        <button onClick={() => editHandler(exerciseData)} style={{display:'flex', justifyContent:'center'}} className="btn btn-warning"><EditIcon/>Edit Item</button>
    )
}

const DeleteButton = ({deleteHandler}) => {
    return(
        <button onClick={() => deleteHandler()} style={{display:'flex', justifyContent:'center'}} className="btn btn-danger"><DeleteIcon />Delete Item</button>
    )
}

const ExreciseDisplay = ({exerciseData, BASE_URL, editHandler, deleteHandler}) => {
    
    return ( 
        <div style={{maxWidth:'800px', margin:'auto'}}>

            <DisplayItem 
                label={'Exercise Name: '}
                value={exerciseData.exerciseName}
            />

            <DisplayItem 
                label={'Repetition Type: '}
                value={exerciseData.repetitionType}
            />

            {/* <DisplayItem 
                label={'Rest in Seconds: '}
                value={exerciseData.restInSec}
            /> */}

            <DisplayItem 
                label={'Calorie per '+ exerciseData.repetitionType + ':'}
                value={String(exerciseData.calsPerRep) + ' calories'}
            />  

            <DisplayItem 
                label={'Active Status: '}
                value={exerciseData.active?'Active': 'Inactive'}
            />

            <DisplayItem 
                label={'Equipments Required: '}
                value={exerciseData.equipments.join(', ')}
            />

            <DisplayItem 
                label={'Instructions: '}
                style={{display: 'flex', flexDirection: 'column'}}
            >
                {exerciseData.instructions?exerciseData.instructions.map((instruction, index) => (
                    <DisplayItem key={index}
                        label={`Step: ${instruction.step}`} 
                        value={instruction.description}    
                    />
                )):<></>}
            </DisplayItem>
            <br />
            <DisplayItem label={'Images: '}/>     



                {/* {exerciseData.imageUrl1 && exerciseData.imageUrl1 ? */}
                
                <div style={{marginLeft: '20px'}}>
                    <img style={{margin: '10px'}} src={
                        exerciseData.imageUrl1?
                        exerciseData.imageUrl1: 
                        (exerciseData.images && exerciseData.images[0] && exerciseData.images[0].filename ?BASE_URL+'/media/'+exerciseData.images[0].filename:'')
                    } height='200px'/>
                    <img style={{margin: '10px'}} src={
                        exerciseData.imageUrl2?
                        exerciseData.imageUrl2: 
                        (exerciseData.images && exerciseData.images[1] && exerciseData.images[1].filename ?BASE_URL+'/media/'+exerciseData.images[1].filename:'')
                    } height='200px'/>
                </div>

                    {/* :
                    
                <div style={{display:'flex', flex:1, flexWrap: 'wrap',marginLeft: '40px'}}>
                {exerciseData.images?exerciseData.images.map((image, index) => {
                    let src = BASE_URL+'/media/'+image.filename
                    return(<img style={{margin: '10px'}} src={src} height='200px'></img>)
                }):<></>}
                </div>
                
                
                } */}

            <br />
            <DisplayItem label={'Explaination Video: '} value={exerciseData.videoEmbedString?"":'Not available'}/>  
            <div style={{width: '360px', marginLeft: '30px', marginBottom: '20px'}}dangerouslySetInnerHTML={{__html: exerciseData.videoEmbedString}} />
                

            
            {/* Display Video On server */}
            {/* {exerciseData.video?exerciseData.video.map((video, index) => {
                let src = BASE_URL+'/media/'+video.filename
                console.log(src)
                return(<Player src={src} style={{maxWidth: '620px', marginLeft: '50px'}}/>)
            }):<></>} */}

        
            <br />
            <div style={{display: 'flex'}}>
                <EditButton 
                    editHandler={editHandler} 
                    exerciseData={exerciseData}/>
                &nbsp;&nbsp;
                <DeleteButton 
                    deleteHandler={deleteHandler}
                />
            </div>
        </div>
  );
}

export default ExreciseDisplay