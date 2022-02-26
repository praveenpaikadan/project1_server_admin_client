import './sidenav.css'; 
import Logo from '../assets/logo';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { logout } from '../fetch-handlers/admin-user';
import { useHistory } from 'react-router-dom';
import { LoginContext } from '../context/loginContext';
import { toast } from 'react-toastify';
import pngLogo from '../assets/logo300X300.png'

function SideNav(props) {


    const middleItems = props.tabs
    const [active, setActive] = useState(-1)
    const history = useHistory()
    const handleChange = (index) => {
        setActive(index)
    }

    const { userData, setUserData } = useContext( LoginContext)

    const handleLogOutClick = () => {
        var res = window.confirm('Are you sure to log out?')
        if(res){
            logout()
            .then((res) => { 
                toast.success('Succesfully Logged Out.'); 
                history.push('/login');  
                setUserData(false)
            })
            .catch(err => {
                console.log(err)
                // toast.success('Succesfully Logged Out.'); 
                history.push('/login');  
                setUserData(false)
            })
        }
    }


    return (
      <div id="sidenav">
            <div id="sidenav-internal-wrapper">
            <div className="sidenav-topContainer">
                {/* <Logo/> */}
                <img src={pngLogo} width={150} height={150}  alt={'logo'} />
            </div>

            <div className="sidenav-middleContainer">
                {!props.children? 
                    middleItems.map((item, index) => (
                        <Link to={item[2]} style={{ textDecoration: 'none', color: 'white' }} key={String(index)}><div 
                            key={index}
                            className={
                                active===index?
                                "sidenav-navItemActive":
                                "sidenav-navItem"
                            }
                            onClick= {()=> handleChange(index)}
                        >
                            {item[1]} {item[0]}
                        </div>
                        </Link>    
                    ))    
                :
                    props.children
                
                }

                
            </div>

            <div className="sidenav-bottomContainer">
                <div 
                    onClick={()=> setActive(-1)}
                    className="sidenav-navItem"
                    >
                    <SettingsApplicationsIcon style={{ fontSize: 20, marginRight:'10px'}} />
                    Settings
                </div>
                <div className="sidenav-navItem" onClick={() => handleLogOutClick()}>
                    <ExitToAppIcon style={{ fontSize: 20, marginRight:'10px' }}/>
                    Logout
                </div>
            </div>
        </div>
      </div>
    );
  }
  
  export default SideNav;