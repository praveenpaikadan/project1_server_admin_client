import { Avatar } from '@material-ui/core';
import av from '../assets/profile.jpg'

const AvatarName = ({name, email, uri, width}) => {
    
      return (<div className={'hoverable'} style={{display: 'flex', alignItems:'center', padding: '10px'}}>
      <Avatar alt={name} src={uri} style={{height: '2.5em', width: '2.5em' }}/>
      <div style={{marginLeft: '10px', width:width?width:'200px', display: 'flex', flexDirection:'column', justifyContent: 'flex-start'}}>
        <label style={{margin: 0}}>{name}</label>
        <label style={{margin: 0,fontSize: '12px'}}>{email}</label>
      </div>
    </div>)
  }

export default AvatarName;
export {AvatarName};