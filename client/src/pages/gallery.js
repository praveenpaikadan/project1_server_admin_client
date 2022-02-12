import './gallery.css'
import React, {useState, useEffect} from 'react'
import { ImageUpload } from '../components/image-upload';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { BASE_URL } from '../App';
import axios from 'axios';


import {Progress} from 'reactstrap';
import {  toast } from 'react-toastify';
import Loader from '../components/loader';
import Delete from '@mui/icons-material/Delete';
axios.defaults.withCredentials = true

const getImageFiles = (imageList) => {
    let images= imageList.map(imageData => {
        return imageData['file']
    })
    return images
}


export const GeneralImageUpload = ({refresh, collapsed}) => {

    // upload function 
    const [imageList, setImageList] = useState([])
    const [addimagesVisible, setAddImagesVisible] = useState(collapsed?false:true)
    const [identifierText, setIdentifierText] = useState('')
    const [error, setError] = useState('')
    const [progress, setProgress] = useState(0)

    const handleUpload = () => {
        setProgress(0)
        if(!imageList[0]){
            setError('No image selected..')
            return
        }else if(!identifierText){
            setError('Enter an identifier text..')
            return
        }
        setError('')
        var bodyFormData = new FormData();
        var images = getImageFiles(imageList) 
        images.forEach((item) => bodyFormData.append("images", item))
        bodyFormData.append("identifierText", identifierText)
        console.log(imageList)

        axios.post(BASE_URL+ "/handle-media", bodyFormData, {
            onUploadProgress: ProgressEvent => {
                setProgress((ProgressEvent.loaded / ProgressEvent.total*100),
            )}
        })
        .then(res => { 
            toast.success('upload success')
            setIdentifierText('')
            refresh()
        })
        .catch(err => { 
            console.log(err)
            toast.error('upload fail')
        })
    }

    return(
        <div>
            <div className='image-upload-container'>
                <span id='add-image-header'>
                    <h5>Add Images</h5>
                    <Switch 
                        checked={addimagesVisible}
                        onChange={(value) => {setAddImagesVisible(value.target.checked)}}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </span>
                <div style={{display:  addimagesVisible?'block':'none'}}>
                    <ImageUpload setImageList={setImageList} maxNumber={1}/>
                    <TextField margin='normal' fullWidth id="outlined-basic" value={identifierText} onChange={(event) => {setIdentifierText(event.target.value)}} value={identifierText} label="Identifying description" variant="outlined" display='block' size='small' />
                    <p style={{marginRight: "10px"}}>{error}</p>
                    <Progress max="100" color="success" value={progress} >{Math.round(progress,2) }%</Progress>
                    <Button style={{marginTop: '10px'}} variant="outlined" onClick={() => {handleUpload()}} >Upload</Button>
                </div>
            </div>
        </div>
    )
}


const ImageItem = ({data, showDelete, handleDelete, copyFullUrl}) => {

    const handleClick = () =>  {
        navigator.clipboard.writeText((copyFullUrl?BASE_URL:'')+ data.relativeUrl)
        toast.success('Copied url: '+ (copyFullUrl?BASE_URL:'')+ data.relativeUrl)
    };

    return(
        <div className='image-container-wrapper'>
        <div className='image-item-container' onClick={() => {handleClick()}}>
            <img src={BASE_URL+data.relativeUrl}></img>
            <div className='text-container'>
                <p>{data.identifierText}</p>
            </div>
        </div>
       {showDelete? <div className={'delete-container'} style={{ margin: 'auto',border: 'solid 1px red', width: '50%', height: 30, borderRadius: 15, display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}
            onClick={() => {handleDelete(data._id)}}
        > 
            <Delete size={30}/>
        </div>:null}
        </div>
    )
}

export const ImageSearch = ({reload, refresh, heading, searchBoxStyle, imageContainerStyle, showDelete}) => {
    const [imageData, setImageData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(true)
    const [search, setSearch] = useState('')

    const handleDeleteImage = (id) => {
        if(!window.confirm('Are your sure to delete this image?')){
            return
        }

        axios.delete(BASE_URL+'/handle-media/' + id)
        .then((response) => {
            toast.success('Deleted Succesfully')
            refresh()
        })
        .catch(() => {
            toast.error('Failed To delete')
            refresh()
        })
    }

    useEffect(() => {
        setLoading(true)
        setError(null)
        var exists = true
        axios.get(BASE_URL+'/handle-media/getall')
        .then((response) => {
            if(exists){
                var modified = response.data?response.data.map((item => {item.label = item.identifierText; return item})):null
                setImageData(response.data)
                setLoading(false)
            }
        })
        .catch(() => {
            if(exists){
                setError(true)
                setLoading(false)
            }
        })
        return () => {
            exists = false
        }
    }, [reload])

    const [copyFullUrl, setCopyFullUrl] = useState(false)

    return(
        <div style={{flex:1, display: 'flex', flexDirection: 'column'}}>
            {heading?<h1 className="page-heading">{heading}</h1>:null}
            <div>
                <Autocomplete
                    disablePortal
                    // freeSolo={true}
                    onChange={(e, v) => {if(v && v.identifierText){setSearch(v.identifierText)}}}
                    id="combo-box-demo"
                    options={imageData}
                    sx={{ maxWidth: 300, marginLeft:'auto', marginRight: '60px',marginTop: '40px', marginBottom: '40px',...searchBoxStyle }}
                    renderInput={(params) => <TextField fullwidth value={search} onChange={(e) => {setSearch(e.target.value)}} {...params} label="Search Images" />}
                />
                <p style={{marginLeft: '20px', display:'block', color: 'gray'}}>Select to copy url</p>
                <input checked={copyFullUrl} onChange={(e => setCopyFullUrl(e.target.checked))} type="checkbox" id="vehicle1" name="vehicle1" value="Bike" style={{marginRight: '10px'}}/>
                <label for="vehicle1"> Copy full url</label>
            </div>
            <div style={{flex:1,  width: '100%', overflow: 'scroll', borderRight: '10px solid white'}}>
                {loading?

                <Loader position='center'/>:

                (!error?
                <div className='content-main-wrapper' style={{...imageContainerStyle}}>
                    {(imageData).filter(item => {return item.identifierText.toLowerCase().includes(search.toLowerCase())}).map((item) => (<ImageItem key={item._id} data={item} copyFullUrl={copyFullUrl} showDelete={showDelete} handleDelete={handleDeleteImage}/>))}
                </div>:
                <div onClick={() => {refresh()}}>{error}</div>)
                }
            </div>
        </div>
    )

}

const Gallery = () => {

    const [reload, setReload] = useState(true)
    const refresh = () => {setReload(!reload)}

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh'}}>
            <ImageSearch reload={reload} refresh={refresh} heading={'Gallery'} showDelete={true}/>
            <div style={{width: '300px' , backgroundColor: '#e6e6e6', padding: '20px', height: '100vh', marginBottom: '20px'}} >
                <GeneralImageUpload refresh={refresh}/>
            </div>
        </div>
    )

}

export default Gallery;