
import { useState, useEffect, useRef } from 'react';
import {set, useForm} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { ImageUpload } from '../components/image-upload';
import VideoUpload from '../components/video-upload';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Schedule from './schedule'
import {TextField, MultiTextField, MultiSelectField, OptionField, OtherField, RadioField} from '../components/fields'
import Subscription from './subscription'
import MultiSelectClientList from './client-select'
import ScrollablePage from '../components/scrollable-page'
import { useHistory, useRouteMatch } from 'react-router-dom';
import Schedule2 from './shedule2';
import { DriveVideoWrapperCopyButton } from '../components/copy-wrapper-button';
import { getFullUrlIfRelative } from '../utilities/helpers';
import { BASE_URL } from '../App';

axios.defaults.withCredentials = true

const getImageFiles = (imageList) => {
    let images= imageList.map(imageData => {
        return imageData['file']
    })
    return images
}

const schema = yup.object().shape({
    programName: yup.string().required(),
    durationWeeks: yup.number().integer(),
    daysPerWeek: yup.number().integer(),
    category: yup.string().required(),
    keyWords: yup.string().required()
    // goal: yup.string().required(),
    // otherRemarks: yup.string().required(),
  });

const ProgramForm = ({data}) => {

    const [id, setId] = useState(data?data._id:null)

    useEffect(() => {
        window.scroll(0,0)
    }, [])

    // const {path, url}  = useRouteMatch();
    // const history = useHistory()
    
    const { register, watch, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
      });
    
    const [progress, setProgress] = useState(0)
    
    

    const dv = data?data:{
        meta : {
            subscribers:[],
            feedbacks:[
                {
                    feedbackDate: '',
                    subscriber : '',
                    review: '',
                    rating: '',
                }
            ]
        },
    
        programName: '', 
        keyWords: '', 
        category: '',
        durationWeeks : '',
        daysPerWeek : '',
        level : '',
        goal: '',  
        equipments : [''],

        subscriptionOptions : 
            [
                {    
                    key:String(Math.random()*(10^16)),
                    planType : '', 
                    description : '',
                    priceInRs : ''
                }
            ],
        // images:[],
        coverImageUrl: '',
        videoEmbedString: '',
        // videos: [],
        active: false,
        type: true,  // public = true, privet = false
        privateClients: [],
        otherRemarks: '',
        generalInstructions: ''
             
    }
    const [type, setType] = useState(String(dv.type))   // true is public false is privet
    
    // const [selectedVideo, setSelectedVideo] = useState(0)
    // const [imageList, setImageList] = useState([])

    
    const [subscriptionData, setSubscriptionData] = useState([])
    const [privateClients, setPrivateClients] = useState(data?data.privateClients:[]) 

    

    // const adequateImageAndVideo = (imageList, selectedVideo) => {
        
        // TBD => later and apply rules accordingly 
        // return true
        // if (data){
        //     if (imageList.length == 0 || imageList.length == 1){
        //         return true
        //     }else{
        //         toast.error('If you are uploading new images, there should be exactly one Image')
        //         return false
        //     }
        // }

        // if (imageList.length !== 1){
        //     toast.error('There should be exactly two Images')
        //     return false
        // }

        // if (!selectedVideo){
        //     toast.error('There should be exactly one video')
        //     return false
        // }
        // return true
    // }

    

    const onSubmit = submitData => {

        console.log()

        setScheduleRetreiver(true) 
        console.log(submitData)
        submitData.schedule=scheduleData.current
        setScheduleRetreiver(false)

        for(let i = 0; i<submitData.schedule.length; i++){
            submitData.schedule[i]['day']= i+1
        }


        submitData.equipments = submitData.equipments.split(",") 
        submitData.subscriptionOptions = subscriptionData

        if (String(submitData.type) === 'false'){
            submitData.privateClients = privateClients
        }
        if(coverImage){
            submitData.coverImage = coverImage
        }
        if(videoEmbedString){
            submitData.videoEmbedString = videoEmbedString
        }


        console.log(submitData)

        var submitDataString = JSON.stringify(submitData)
        
        // Varifying image and video
        // if (!adequateImageAndVideo(imageList, selectedVideo)){
        //    return 
        // };

        // making new form data to send
        var bodyFormData = new FormData();
        // attaching data obtianed through default page submit
        bodyFormData.append('data', submitDataString)

        
        // console.log(submitDataString)
        // return

        //attaching image files and video file


        
        if(!id){                                                  // POST REQUEST
            // var images = getImageFiles(imageList) 
            // images.forEach((item) => bodyFormData.append("images", item))
            // bodyFormData.append('videos', selectedVideo)


            // sending data and listenong for  progress and result(status)
            axios.post(BASE_URL+ `/programs`, bodyFormData, {
                onUploadProgress: ProgressEvent => {
                    setProgress((ProgressEvent.loaded / ProgressEvent.total*100),
                )}
            })

            .then(res => { 
                toast.success('Upload success')
                setId(res.data._id)
                // var redirectID = res.data['response']['_id']
                // var redirectUrl = path.split('/')
                // redirectUrl.pop()
                // history.push([...redirectUrl, redirectID].join("/"))
            })
            .catch(err => { 
                console.log(err)
                toast.error('Upload failed')
                setProgress(0)
            })
            
        }else{

            bodyFormData.append("id",id)    

            // if (imageList.length != 0){                                                      // PATCH REQUEST
            //     var images = getImageFiles(imageList)
            //     images.forEach((item) => bodyFormData.append("images", item))
            // } 
            // if (selectedVideo != 0){
            //     bodyFormData.append('videos', selectedVideo)
            // }

            // sending data and listenong for  progress and result(status)
            axios.patch(BASE_URL+ `/programs`, bodyFormData, {
                onUploadProgress: ProgressEvent => {
                    setProgress((ProgressEvent.loaded / ProgressEvent.total*100),
                )}
            })
            .then(res => { 
                toast.success('Edit success')
            })
            .catch(err => { 
                toast.error('Edit failed')
                setProgress(0)
            })
        }
    }

    const [coverImage, setCoverImage] = useState(dv.coverImage || null)
    const [videoEmbedString, setVideoEmbedString ] = useState(dv.videoEmbedString || null)

    const [scheduleRetreiver, setScheduleRetreiver] = useState(false)
    const scheduleData = useRef(null)

    const exportSchedule = (val) => {
        scheduleData.current = val
    }

    // console.log(watch("example")); // watch input value by passing the name of it
  
    return (
      /* "handleSubmit" will validate your inputs before invoking "onSubmit" */

      <ScrollablePage heading = {data?'Edit Program':'Add New Program'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <fieldset className='form'>   
            <TextField label="Program Name" dv={dv.programName} name='programName'  required={true} errors={errors} register={register} options={['required']}/>
            <TextField label="Key Words " dv={dv.keyWords} name='keyWords'  required={true} errors={errors} register={register} options={['required']}/>
            <TextField label="Category (Eg: Muscle Build, Weigh Loss, General Fitness ..) " dv={dv.category} name='category'  required={true} errors={errors} register={register} options={['required']}/>
            <TextField label="Duration in Weeks" dv={dv.durationWeeks} number={true} name='durationWeeks'    required={true} errors={errors} register={register} options={['required']}/>
            <TextField label="Days per Week" dv={dv.daysPerWeek} number={true} name='daysPerWeek'      required={true} errors={errors} register={register} options={['required']}/>
            <OptionField label='Level' dv={dv.level}  name='level'            required={true} errors={errors} register={register} options={['Beginner', 'Intermediate', 'Advanced']}/> 
            <TextField label="Equipments Required (Seperate by comas)" dv={dv.equipments.join()} name='equipments'      required={false} errors={errors} register={register}/>
            
            <MultiTextField label="Write a Goal (Detailed description of what program aims-This is shown in the program info screen)" dv={dv.goal} name='goal'     required={true} errors={errors} register={register} options={['required']} />
            
            <MultiTextField label="General Instructions (This will be visible to the client once the program is subscribed. Details regarding general conduct, rest period, best practices like timings, suggestions or reccomendations etc.. can be included in this. Write in paragraphs, subheadings etc .. This will be accessible from the home page)"  dv={dv.generalInstructions} name='generalInstructions' required={true} errors={errors} register={register} />
            <OtherField label={'Schedule'}>
                <Schedule2 dv={dv.schedule} scheduleRetreiver={scheduleRetreiver} exportSchedule={exportSchedule}/>
            </OtherField> 

            <MultiTextField label="Other Remarks (Shown in order page - HTML allowed)"  dv={dv.otherRemarks} name='otherRemarks' required={true} errors={errors} register={register} options={['required']} />
            <OtherField label={'Subscription Options'}>
                <Subscription dv={dv.subscriptionOptions} setSubscriptionData={setSubscriptionData}/>
            </OtherField>
            <OptionField label='Program Beneficiary Type' dv={dv.type} name='type' onChange = {setType} requires={true} errors={errors} register={register} options={['Public', 'Private']} value={[true, false]}/>
            
            {type == 'false'?<MultiSelectClientList dv={dv.privateClients} label={'Select Clients'} setPrivateClients={setPrivateClients}/>:<></>}
            <OptionField label='Active Status' dv={dv.active} name='active' requires={true} errors={errors} register={register} options={['Active', 'Inactive']} value={[true, false]}/> 
            
            <div>
                <label>Cover Image Url (Single)</label>
                <textarea name={'coverImage'} defaultValue={dv.coverImage} onBlur={e => setCoverImage(e.target.value)}/>
            </div>

            <div style={{display: 'flex', flexDirection:'row', overflowX: 'scroll', width: '100%'}}>
                {coverImage && coverImage !== ''?<img src={getFullUrlIfRelative(coverImage.trim())} height='150'></img>: null}
            </div>

            <div>
                <div>
                <label>Cover Video Embed String</label>
                <DriveVideoWrapperCopyButton style={{marginLeft: 'auto'}}/>
                </div>
                <textarea name={'videoEmbedString'} defaultValue={dv.videoEmbedString} onBlur={e => setVideoEmbedString(e.target.value)}/>
            </div>

            <div style={{width: '100%'}}>
                {videoEmbedString !== ''?<div style={{width: '360px', marginBottom: '20px'}}dangerouslySetInnerHTML={{__html:videoEmbedString}} />: null}
            </div>

            {/* <div>
                <label>Images (Not required if image url is given)</label>
                {data?<span>(Add images only if you want to replace the current ones)</span>:<></>}
                <ImageUpload setImageList={setImageList} maxNumber={2}/>
            </div> */}

            {/* <div>
                <label>Upload Video(Not required if video embed string is given)</label>
                {data?<span>(Add video file only if you want to replace current video)</span>:<></>}
                <VideoUpload setSelectedFile={setSelectedVideo}/>
                <div class="form-group">
                    <Progress max="100" color="success" value={progress} >{Math.round(progress,2) }%</Progress>
                </div>
            </div> */}

            <button style={{margin: 'auto' }} type="submit" class="btn btn-success btn-block btn-lg">Upload</button> 
            <br />
        </fieldset>
      </form>
      </ScrollablePage>
    );
  }

export default ProgramForm;