import React, { Component } from 'react';

export const DriveVideoWrapperCopyButton = ({style}) => {

    var wrapperText = 
    
`<div style="position: relative;">



<div id="popout-cover" style="width: 80px; height: 80px; position: absolute; opacity: 0; right: 0px; top: 0px;"></div>
<div id="fs-cover" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({fsPressed:true}))" style="width: 50px; height: 40px; position: absolute; opacity: 0; right: 0px; bottom: 0px;"></div>
</div>`
    

    return (
        <button onClick={(e) => {e.preventDefault(); navigator.clipboard.writeText(wrapperText)}} style={{...style}} class="btn btn-info btn-sm">Copy GDV wrapper</button>
    )
}