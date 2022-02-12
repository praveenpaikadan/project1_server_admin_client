import React from 'react';
import ImageUploading from 'react-images-uploading';
import './image-upload.css';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export function ImageUpload({setImageList, maxNumber}) {

    const [images, setImages] = React.useState([]);


    const onChange = (imageList, addUpdateIndex) => {
      // data for submit
      setImages(imageList);
      setImageList(imageList)
    };
   
    return (
      <div className="App">
        <ImageUploading
          className="image-upload-box"
          multiple
          value={images}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            // write your building UI
            <div className="upload__image-wrapper">
              <button
                className='click-or-drop-button'
                style={isDragging ? { color: 'red' } : undefined}
                onClick={(e) => {e.preventDefault() ; onImageUpload()}}
                {...dragProps}
              >
                Click or Drop here
              </button>
              &nbsp;
              
              <div className='uploaded-images-container'>


              {imageList.length!=0?imageList.map((image, index) => (
                <div key={index} className="image-item" style={{
                  backgroundImage: `url(${image['data_url'] })`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  }}>
                  <div className="image-item__btn-wrapper">
                    <button onClick={(e) => {e.preventDefault(); return onImageUpdate(index)}}><EditIcon /></button>
                    <button onClick={(e) => {e.preventDefault(); return onImageRemove(index)}}><DeleteIcon /></button>
                  </div>
                </div>
              )):<h1 style={{margin:'auto', opacity:0.3}}>Images</h1>}
              </div>
              <button className='onclick-remove-button' onClick={(e) => {e.preventDefault();onImageRemoveAll()}}>Remove all images</button>
            </div>
          )}
        </ImageUploading>
      </div>
    );
  }