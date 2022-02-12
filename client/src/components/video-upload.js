import React, {useState} from 'react'


const VideoUpload = ({setSelectedFile}) => {

    const onChangeHandler=event=>{
        console.log(event.target.files[0])
        setSelectedFile(event.target.files[0])
    }

  return (
    <div class="container">
      <div class="row">
        <div class="col-md-6">
            <form method="post" action="#" id="#">
                  <div class="form-group files">
                    <label>Upload Your File  </label>	&nbsp;
                    <input type="file" name="file" accept="video/mp4,video/x-m4v,video/*" onChange={onChangeHandler}/>
                  </div>
              </form>
        </div>
      </div>
    </div>
  )}

export default VideoUpload;