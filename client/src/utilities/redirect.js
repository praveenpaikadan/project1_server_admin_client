
const redirectAfterNew = (history, currentPath, redirectID) => {
    var path = currentPath
    var redirectUrlArray = path.split('/')
    redirectUrlArray.pop()
    history.push([...redirectUrlArray, redirectID].join("/"))
};


const redirectAfterDelete = (history, currentPath) => {
    var path = currentPath
    var redirectUrlArray = path.split('/')
    redirectUrlArray.pop()
    history.push(redirectUrlArray.join("/"))
}


export {redirectAfterDelete, redirectAfterNew};