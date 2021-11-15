const fs = require('fs')

const deleteFiles = (files, folder_name) => {

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

module.exports = {deleteFiles}