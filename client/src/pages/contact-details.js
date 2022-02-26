import { Avatar } from '@material-ui/core';
import av from '../assets/profile.jpg'
import ListPage from './list-page'
import { getAllProgramData } from '../fetch-handlers/programs';
import { useState, useEffect } from 'react';
import { getAllExerciseData } from '../fetch-handlers/exercise';
import { ImageUpload } from '../components/image-upload';
import { BASE_URL } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/loader';



function ContactForm(){

    const [data, setData] = useState({
            name: '',
            email: '',
            phone: '',
            whatsapp: '',
            website: '',
            address: '',
            detailedWriteup: '',
            info: '',
            infolink: '',   
            photo: {url: ''}   
        }
    )

    const [active, setActive] = useState(false)
    const [error, setError] = useState('')
    const [imageList, setImageList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(BASE_URL +  '/contact')
        .then(res => {
            if(res.status === 200){
                if(res.data[0]){
                    setData(res.data[0])
                }
            }else{
                toast.error('Failed to fetch contact details. Please reload page')
            }
            setLoading(false)
        })
        .catch(error => {
            toast.error('Failed to fetch contact details. Please reload page')
            setLoading(false)
        })
    }, [])

    const handleSubmit = async () => {
        if(!active){
            setActive(true)
            return
        }

        setError('')
        var req = ['name', 'email', 'phone', 'whatsapp', 'website', 'address']
        for(var field of req){
            if(!data[field]){
                setError('Required '+field)
                return
            }
        }

        var submitData = new FormData()
        submitData.append('data', JSON.stringify(data))
        if(imageList[0]){submitData.append('photo',imageList[0]['file'])}

        let res = await axios.post(BASE_URL+'/contact', submitData)
        if(res.status === 200){
            toast.success('Updated Contacts')
        }else{
            console.error('Failed t update contacts')
        }

        
    }

    const handleChange = (field, value) => {
        var oldData = {...data}
        oldData[field] = value
        setData(oldData)
    }
    if(loading){
        return <Loader position='center'/>
    }

    return(
        <div>
        <fieldset disabled={!active} className='form' >   
            <div>
                <label>Name</label>
                <input required name={'name'} value={data.name} onChange={(e) => {handleChange('name', e.target.value)}}/>
            </div>
            <div>
                <label>Email</label>
                <input required name={'email'} value={data.email} onChange={(e) => {handleChange('email', e.target.value)}}/>
            </div>
            <div>
                <label>Phone Number(with country code)</label>
                <input required name={'phone'} value={data.phone} onChange={(e) => {handleChange('phone', e.target.value)}}/>
            </div>
            <div>
                <label>Whatsapp Number(with country code)</label>
                <input required name={'whatsapp'} value={data.whatsapp} onChange={(e) => {handleChange('whatsapp', e.target.value)}}/>
            </div>
            <div>
                <label>Website</label>
                <input required name={'website'} value={data.website} onChange={(e) => {handleChange('website', e.target.value)}}/>
            </div>
            <div>
                <label>Address</label>
                <input required name={'address'} value={data.address} onChange={(e) => {handleChange('address', e.target.value)}}/>
            </div>
            <div>
                <label>Location Latitute</label>
                <input type='number' required name={'lat'} value={data.lat} onChange={(e) => {handleChange('lat', e.target.value)}}/>
            </div>
            <div>
                <label>Location longitude</label>
                <input type='number' required name={'long'} value={data.long} onChange={(e) => {handleChange('long', e.target.value)}}/>
            </div>

            <div>
                <label>Detailed write up on trainer. Qualifcation, experience etc...)</label>
                <textarea name={'deatailedWriteup'} value={data.detailedWriteup} onChange={(e) => {handleChange('detailedWriteup', e.target.value)}}/>
            </div>

            <div>
                <label>Additional details (Short approx. 50 charecters)</label>
                <input required name={'info'} value={data.info} onChange={(e) => {handleChange('info', e.target.value)}}/>
            </div>
            <div>
                <label>Additional link (Optional, User will be navigated to this link if clicked on the additional details)</label>
                <input required name={'infolink'} value={data.infolink} onChange={(e) => {handleChange('infolink', e.target.value)}}/>
            </div>

            

            <div>
            <label>Profile Image</label>
            {active?
            <ImageUpload setImageList={setImageList} maxNumber={1}/>
                :
                <img style={{width: 200, margin: 'auto'}} src={data.photo?BASE_URL + '/media/' + data.photo['filename']:'' } alt='No Profile Photo Available' ></img>
            }
            </div>
            {error?<p style={{margin: 'auto', color:'red', marginBottom: 10}} >{error}</p>:null}
        </fieldset>
         <button style={{margin: 'auto', maxWidth: 200}} onClick={() => {handleSubmit()}} type="submit" class="btn btn-success btn-block">{active?'Save':'Edit'}</button> 
         </div>
    )
}

function ContactDetails() {
 
  return (
    <div className='main'>
    <div className='container'>
        <div className='wrapperContainer'>
            <div className='unScrollableContainer'>
                <div className='mainName'>Contact Details</div>
            </div>

            <div className='scrollableContainer'>
                <ContactForm />

            </div>
        </div>
    </div>

    <div className='rightContainer'>
        
    </div>
</div>   
  );
}

export default ContactDetails;
