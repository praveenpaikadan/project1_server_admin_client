import { BASE_URL } from "../App"

export const arrayRange = (start, end, step) => {
    var returnArray = []
    for(let i = start; i < end ; i=i+step){
        returnArray.push(i)
    }
    return returnArray
}

export const convDecimalTime = (decimalTime) => {   // input eg : 6.5 for returning 06: 30 AM
    let dt  = Number(decimalTime)
    let hour24 = Math.floor(dt)
    let minFrac = dt - hour24
    let hrString = String(hour24 <= 12 ? hour24 : hour24 - 12)
    let amOrPm = dt > 12 ? "PM" : "AM"
    let minString = String(Math.round(60*minFrac))
    minString = minString.length === 1? '0'+minString: minString
    return hrString+ ":"+minString + " "+amOrPm
}

export const getFullUrlIfRelative = (potUrl) => {
    if(potUrl.substring(0,7) === `/media/`){
        return BASE_URL + potUrl
        
    }else{
        console.log(potUrl)
        return potUrl
    }
}

export const getServerMediaUrl = (filename) => {
    return BASE_URL + '/media/' + filename 
}

export const convertdmy_to_myd = (date) => {
    var arr = date.split('-')
    return [arr[1], arr[0], arr[2]].join('-')
}