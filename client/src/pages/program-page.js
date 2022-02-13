
import SideNav from '../components/sidenav';
import { useState, useEffect } from 'react';
import './details-page.css'; 
import BackButton from '../components/back-button';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import ProgramDisplay from '../major-components/program-display';
import ProgramForm from '../major-components/program-form';
import Loader from '../components/loader';
import FailedBanner from '../components/failed-banner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../App';
import { useParams, useHistory, useRouteMatch } from 'react-router';
import { redirectAfterDelete } from '../utilities/redirect';
import { GeneralImageUpload, ImageSearch } from './gallery';


const ProgramPage = () => {

    const {id} = useParams()
    const history = useHistory()
    const {path, url} = useRouteMatch()

    const [content, setContent] = useState(
        <div className= 'loaderContainer'>
            <Loader position={'center'}/>
        </div>
    )

    async function getProgramData(id){
        let res = await axios.get(BASE_URL+`/programs/${id}`)
        let fetchedData = await res.data.response
        return fetchedData
    }

    async function deleteProgram(id){
        let res = await axios.delete(BASE_URL+`/programs/${id}`)
        return res
    }

    const [editOver, setEditOver] = useState(false)
    const editHandler = (programData) => {
        setContent(<ProgramForm data={programData} setEditOver={setEditOver}/>)
    }

    const deleteHandler = (programData) => {
        if (window.confirm("Do you want to delete?")) {
        }else{
            return
        }
        deleteProgram(id)
        .then(res => {
            if(res.status === 200) {
                toast.success('Success! Deleted Program')
                redirectAfterDelete(history, path)
            }
        })
        .catch(err => {
            toast.error('Failed! Not able to delete')
        })
    }

    useEffect(()=>{
        if(!id){
            setContent(<ProgramForm />) 
            return
        }
        getProgramData(id)
        .then(fetchedData => {
            if (fetchedData !== null){
                console.log(fetchedData)
            setContent(
                <ProgramForm data={fetchedData}/>
                // <ProgramDisplay 
                //     programData={fetchedData}
                //     editHandler={editHandler}
                //     deleteHandler={deleteHandler}
                //     BASE_URL={BASE_URL}
                // />
                )
            }else{
                setContent(
                    <FailedBanner message={'Not able to find this program in database'} position={'center'}/>    
                )
            }
        })
        .catch(err => {setContent(
            <FailedBanner message={'Failed to fetch data'} position={'center'}/>
        )
        })
    }, [id, editOver])


    const sideTabClickHandler = () => {
        console.log('Clicked back')
    }

    const [imageReload, setImageReload] = useState(true)
    const imageRefresh = () => {setImageReload(!imageReload)}

    return (

        <div className='main'>
            <div className='container'>
                <div className='wrapperContainer'>
                    <div className='unScrollableContainer'>
                        <div className='mainName'>Programs</div>
                    </div>

                    <div className='scrollableContainer'>
                        {content}
                    </div>
                </div>
            </div>

            <div className='rightContainer'>
                <GeneralImageUpload refresh={imageRefresh} collapsed={true}/>

                <ImageSearch
                reload={imageReload} 
                refresh={imageRefresh} 
                searchBoxStyle={{margin: 0}}
                imageContainerStyle={{ flex: 1,flexDirection: 'row', alignItems:'center', height: '400px', width: '200px', marginBottom: '40px', overflow: 'scroll'}}
                />

            </div>
        </div>    
  );
}

export default ProgramPage