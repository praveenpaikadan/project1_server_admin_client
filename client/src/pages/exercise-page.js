
import SideNav from '../components/sidenav';
import { useState, useEffect } from 'react';
import './details-page.css'; 
import BackButton from '../components/back-button';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import ExreciseDisplay from '../major-components/exercise-display';
import ExerciseForm from '../major-components/exercise-form';
import Loader from '../components/loader';
import FailedBanner from '../components/failed-banner';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../App';
import { useParams, useHistory, useRouteMatch } from 'react-router';
import { redirectAfterDelete } from '../utilities/redirect';
import Gallery, { GeneralImageUpload, ImageSearch } from './gallery';

const ExercisePage = () => {

    const {id} = useParams()
    const history = useHistory()
    const {path, url} = useRouteMatch()

    const [content, setContent] = useState(
        <div className= 'loaderContainer'>
            <Loader position={'center'}/>
        </div>
    )

    async function getExerciseData(id){
        let res = await axios.get(BASE_URL+`/exercises/${id}`)
        let fetchedData = await res.data.response
        return fetchedData
    }

    async function deleteExercise(id){
        let res = await axios.delete(BASE_URL+`/exercises/${id}`)
        return res
    }

    const [editOver, setEditOver] = useState(false)
    
    const editHandler = (exerciseData) => {
        setEditOver(false)
        setContent(<ExerciseForm data={exerciseData} setEditOver={setEditOver}/>)
        window.scroll({top: 0, behavior: "smooth"})
    }

    const deleteHandler = (exerciseData) => {
        if (window.confirm("Do you want to delete?")) {
        }else{
            return
        }
        deleteExercise(exerciseData.id)
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

    useEffect(()=>{
        if(!id){
            setContent(<ExerciseForm />) 
            return
        }
        getExerciseData(id)
        .then(fetchedData => {
            if (fetchedData !== null){
            // setContent(
            //     <ExreciseDisplay 
            //         exerciseData={fetchedData}
            //         editHandler={editHandler}
            //         deleteHandler={deleteHandler}
            //         BASE_URL={BASE_URL}
            //     />)
                setContent(<ExerciseForm data={fetchedData}/>)    
            }else{
                setContent(
                    <FailedBanner message={'Not able to find this exercise in database'} position={'center'}/>    
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
                        <div className='mainName'>Exercise</div>
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

export default ExercisePage