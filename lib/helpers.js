const fs = require('fs')

const {APP_API_BASE_URL} = require('./apiUtils')


const deleteFiles = (files, folder_name) => { //folder name within static

    const getMediaUrl = (filename) => {
        let sep =  __dirname.includes('/')?'/':"\\"
        let url = __dirname.split(sep)
        url.pop()
        return ([...url, 'static', folder_name, filename].join(sep))
    }

    files.forEach(file => {
        var mpath = getMediaUrl(file)
        if (fs.existsSync(mpath)){
            console.log(mpath)
            fs.unlink(mpath, err => {
                if (err) {
                    console.log('Failed to delete :' + mpath)
                }else{
                    console.log('File Deleted : ' + mpath) 
                };
            });
        }
    });
    return true
}


const getFullMediaUrlIfRelative = (potRelUrl) => {
    if(!potRelUrl){
        return potRelUrl
    }
    if(potRelUrl.substring(0, 7) === `/media/` ){
        return APP_API_BASE_URL + potRelUrl
    }else{
        return potRelUrl
    }
}


module.exports = {deleteFiles, getFullMediaUrlIfRelative}