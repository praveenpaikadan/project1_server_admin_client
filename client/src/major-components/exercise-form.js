
import { useState } from 'react';
import {set, useForm} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { ImageUpload } from '../components/image-upload';
import VideoUpload from '../components/video-upload';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollablePage from '../components/scrollable-page';
import { redirectAfterDelete, redirectAfterNew } from '../utilities/redirect';
import { useHistory, useRouteMatch } from 'react-router-dom'
import { BASE_URL } from '../App';
import { getFullUrlIfRelative } from '../utilities/helpers';
import { DriveVideoWrapperCopyButton } from '../components/copy-wrapper-button';
axios.defaults.withCredentials = true


const DeleteButton = ({instructions, deleteStep}) => {
    if (instructions.length >= 2){
        return (<button class="btn btn-danger" onClick={(e) => deleteStep(e)}>Delete Steps</button>)
    }else{
        return (<></>)
    }
}

const AddButton = ({instructions, addStep}) => {
    return (<button class="btn btn-success" onClick={(e) => addStep(e)}>Add Steps</button>)
}


// const getImageFiles = (imageList) => {
//     let images= imageList.map(imageData => {
//         return imageData['file']
//     })
//     return images
// }

const schema = yup.object().shape({
    exerciseName: yup.string().required(),
    keyWords: yup.string().required(),
    instruction: yup.string(),
    // restInSec: yup.number().integer().required(),
    calsPerRep: yup.number().required(),
    repetitionType: yup.string().required(),
    // imageUrl1: yup.string(),
    // imageUrl2: yup.string(),
    coverImage: yup.string(),
    explainatoryImages: yup.string(),
    videoEmbedString: yup.string()
  });

const ExerciseForm = ({data}) => {

    const [id, setId] = useState(data?data._id:null)

    const { register, watch, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
      });
    
    const [progress, setProgress] = useState(0)
    const {path, url}  = useRouteMatch();
    const history = useHistory() 

    const [instructions, setInstruction] = useState(data?data.instructions:[{step: 1, description: ''}])
    
    const addStep= (e) => {
        e.preventDefault()
        let num = instructions.length+1
        setInstruction([...instructions, {step: num, description: watch(`step-${num}`)}])
    }
    const deleteStep= (e) => {
        e.preventDefault()
        let new_in = [...instructions]
        new_in.splice(-1,1)
        setInstruction(new_in)
    }

    const updateInstruction = (value, num) => {
        let temp = [...instructions]
        temp[num-1].description = value
        setInstruction(temp)
    }

    const dv = data?data:{
        exerciseName : '',
        keyWords: '',
        repetitionType: '',
        instructions:[{step:1, description:''}],
        active: false,
        equipments: [],
        calsPerRep: '',
        coverImage: '',
        explainatoryImages: '',
    }

    // const [selectedVideo, setSelectedVideo] = useState(0)
    // const [imageList, setImageList] = useState([])

    const [coverImage, setCoverImage] = useState(dv.coverImage)
    const [explainatoryImages, setExplainatoryImages ] = useState(dv.explainatoryImages)
    const [videoEmbedString, setVideoEmbedString ] = useState(dv.videoEmbedString)
    
    // const adequateImage = (imageList) => {

    //     if (imageList.length == 0 || imageList.length == 2){
    //         return true
    //     }else{
    //         toast.error('If you are uploading new images, there should be exactly two Images')
    //         return false
    //     }
    // }

    async function deleteExercise(){
        console.log(id)
        let res = await axios.delete(BASE_URL+`/exercises/${id}`)
        return res
    }

    const deleteHandler = () => {
        console.log()
        if (window.confirm("Do you want to delete?")) {
        }else{
            return
        }
        deleteExercise(id)
        .then(res => {
            if(res.status == 200) {
                toast.success('Success! Deleted exercise ')
                redirectAfterDelete(history, path)
            }
        })
        .catch(err => {
            toast.error('Failed! Not able to delete')
        })
    }


    const onSubmit = submitData => {

        // Varifying image and video
        // if (!adequateImage(imageList)){
        //    return 
        // };

        // making new form data to send
        var bodyFormData = new FormData();
        // attaching data obtianed through default page submit

        if(submitData.equipments){
            submitData.equipments = submitData.equipments.split(',').map(item => item.trim())
        }


        for (let key in submitData){
            bodyFormData.append(key, submitData[key])
        }

        // attaching instruction fields as step-1, 'step-2 etc.. this will be parsed to default schema on reaching server 
        instructions.forEach((instruction) => {
            bodyFormData.append(`step-${instruction.step}`, instruction.description)
        })

        //attaching image files and video file
        if(!id){                                                  // POST REQUEST
            // var images = getImageFiles(imageList) 
            // if (imageList.length != 0){                                                     
            //     var images = getImageFiles(imageList)
            //     images.forEach((item) => bodyFormData.append("images", item))
            // } 
            // if (selectedVideo != 0){
            //     bodyFormData.append('video', selectedVideo)
            // }
            
            // sending data and listenong for  progress and result(status)
            axios.post(BASE_URL+ "/admin/exercises", bodyFormData, {
                onUploadProgress: ProgressEvent => {
                    setProgress((ProgressEvent.loaded / ProgressEvent.total*100),
                )}
            })
            .then(res => { 
                toast.success('Upload success')
                setId(res.data._id)
            })
            .catch(err => { 
                console.log(err)
                toast.error('Upload failed')
                setProgress(0)
            })
            
        }else{
            bodyFormData.append("id", id )
            // if (imageList.length != 0){                                                      // PATCH REQUEST
            //     var images = getImageFiles(imageList)
            //     images.forEach((item) => bodyFormData.append("images", item))
            // } 
            // if (selectedVideo != 0){
            //     bodyFormData.append('video', selectedVideo)
            // }

            // sending data and listenong for  progress and result(status)
            axios.patch(BASE_URL+ "admin/exercises", bodyFormData, {
                onUploadProgress: ProgressEvent => {
                    setProgress((ProgressEvent.loaded / ProgressEvent.total*100),
                )}
            })
            .then(res => { 
                toast.success('Edit success')
            })
            .catch(err => { 
                toast.error('upload fail')
                setProgress(0)
            })
        }
    }


    // console.log(watch("example")); // watch input value by passing the name of it
  
    return (
      /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
      <ScrollablePage heading={id?'Edit Exercise':'Add new Exercise'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <fieldset className='form'>   
            <div>
                <label>Exercise Name</label>
                <input required name={'exerciseName'} defaultValue={dv.exerciseName} {...register('exerciseName', { required: true })} />
                <span>{errors.exerciseName?"Required Field":""}</span>
            </div>

            <div>
                <label>Keywords </label>
                <input required name={'keyWords'} defaultValue={dv.keyWords} {...register('keyWords', { required: true })} />
                <span>{errors.keyWords?"Required Field":""}</span>
            </div>

            <div>
                <label>Intructions</label>
                <fieldset className='instructionContainer'>
                    {instructions.map((instruction, index) => {
                        // This fields are manually added to the form data. to avoid complications of react-hook-form
                        let num = instruction.step;
                        return(
                            <div key={num}>
                                <label>{`Step : ${num}`}</label>
                                <textarea name={`step-${num}`} value={instruction.description} required onChange={(e) => {updateInstruction(e.target.value, num)}} />
                            </div>
                        )
                    })}
                    <div style={{display: 'flex'}}>

                        <AddButton 
                            instructions={instructions} 
                            addStep={addStep}
                        />
                        &nbsp;
                        &nbsp;
                        <DeleteButton 
                            instructions={instructions} 
                            deleteStep={deleteStep}
                        />
                    </div>
                </fieldset>
            </div>
            
            {/* <div> 
                <label>Rest in Seconds</label>
                <input min="0" required type="number" step="1" pattern="\d+" name={'restInSec'} defaultValue={dv.restInSec} {...register('restInSec', { required: true })} />
                <span>{errors.restInSec?"Required time in seconds":""}</span>
            </div> */}

            <div>
                <label>Repetition Type</label>
                <select required name={'repetitionType'} defaultValue={dv.repetitionType} {...register('repetitionType', { required: true })}>
                    <option value="seconds">Time</option>
                    <option value="reps">Reps</option>
                    <option value="kgXreps">Kg X Reps </option>
                </select>
                <span>{errors.repetitionType?"Required Field":""}</span>
            </div>

            <div> 
                <label>Approximate Calories per rep</label>
                <input min={0} step="any" required type="number" pattern="\d+" name={'calsPerRep'} defaultValue={dv.calsPerRep} {...register('calsPerRep', { required: true })} />
                <span>{errors.calsPerRep?"Required Field":""}</span>
            </div>

            <div> 
                <label>Equipments Required (seperated by comas)</label>
                <input name={'equipments'} defaultValue={dv.equipments.join()} {...register('equipments', { required: false })} />
            </div>


            <div>
                <label>Cover Image Url (Single)</label>
                <textarea name={'coverImage'} defaultValue={dv.coverImage} {...register('coverImage', { required: false })} onBlur={e => setCoverImage(e.target.value)}/>
            </div>

            <div style={{display: 'flex', flexDirection:'row', overflowX: 'scroll', width: '100%'}}>
                {coverImage && coverImage !== ''?<img src={getFullUrlIfRelative(coverImage)} height='150'></img>: null}
            </div>

            <div>
                <label>Explanatory Image Urls (Seperated by commas)</label>
                <textarea name={'explainatoryImages'} defaultValue={dv.explainatoryImages} {...register('explainatoryImages', { required: false })} onBlur={e => setExplainatoryImages(e.target.value)}/>
            </div>

            <div style={{display: 'flex', flexDirection:'row', overflowX: 'scroll', width: '100%'}}>
                {explainatoryImages && explainatoryImages !== ''?explainatoryImages.split(',').map(item => <img src={getFullUrlIfRelative(item.trim())} height='150' style={{marginRight: '5px'}}></img>): null}
            </div>


            <div>
                <div>
                <label>Explainatory Video Embed String</label>
                <DriveVideoWrapperCopyButton style={{marginLeft: '20px'}}/>
                </div>
                <textarea name={'videoEmbedString'} defaultValue={dv.videoEmbedString} {...register('videoEmbedString', { required: false })} onBlur={e => setVideoEmbedString(e.target.value)}/>
            </div>

            <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                {videoEmbedString !== ''?<div style={{minWidth: '360px', margin:'auto', marginBottom: '20px'}}dangerouslySetInnerHTML={{__html:videoEmbedString}} />: null}
            </div>


            {/* <div>
                <label>Images (Optional - Only if image urls are not given)</label>
                {data?<span>(Add images only if you want to replace the current ones)</span>:<></>}
                <ImageUpload setImageList={setImageList} maxNumber={2}/>
            </div> */}



            {/* Video Upload to server */}
            {/* <div>
                <label>Upload Video</label>
                {data?<span>(Add video file only if you want to replace current video)</span>:<></>}
                <VideoUpload setSelectedFile={setSelectedVideo}/>
            </div> */}

            <div>
                <label>Active Status</label>
                <select required name={'active'} defaultValue={dv.active} {...register('active', { required: true })}>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                </select>
                <span>{errors.active?"Required Field":""}</span>
            </div>

            <div style={{width: '90%', margin:'auto', marginBottom: '20px'}}class="form-group">
                <Progress max="100" color="success" value={progress} >{Math.round(progress,2) }%</Progress>
            </div>
            
            <div style={{width: '300px', margin: 'auto', marginBottom: '10px'}}>
                <button type="submit" class="btn btn-success btn-block">{id?'Save Edits':'Upload'}</button>
            </div>

        </fieldset>
      </form>

      {id?<div style={{maxWidth: '300px', margin: 'auto'}}>
        <button onClick={() => deleteHandler({_id: id})} class="btn btn-danger btn-block">Delete</button>
      </div>:null}
      
      </ScrollablePage>
    );
  }

export default ExerciseForm;