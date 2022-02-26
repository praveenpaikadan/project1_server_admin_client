// import Logo from './assets/logo'
import './login-page.css'
import { BASE_URL } from './App'
import { LoginContext } from './context/loginContext'
import { useContext, useState, useEffect } from 'react'
import { getCredentials } from './fetch-handlers/admin-user'
import { useHistory } from 'react-router-dom'
import Loader from './components/loader'
import { getCurrentUserData } from './fetch-handlers/admin-user'
import pngLogo from './assets/logo300X300.png' 

const LoginComponent = () => {


    const history = useHistory()
    const { userData, setUserData } = useContext(LoginContext)
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('') 
    const [ loading, setLoading] = useState(true)

    const handleLoginClick = (e) => {
        e.preventDefault()
        var data = {email: email, password: password}
        setLoading(true)
        getCredentials(data)
        .then(user => {
            setUserData(user); 
            setLoading(false)
            history.push('/dashboard')
        })
        .catch((err) => {console.log(err); setUserData(-1);setLoading(false)} )
    }

    useEffect(() => {
        getCurrentUserData()
        .then((data) => {
            setUserData(data); 
            history.push('/dashboard')
        })
        .catch(err => {
          setLoading(false);
          console.log(err)
        })
      }, []);

    if(loading){
        return <Loader position='center'/>
    }
    return(
    <form>
        <div className='cred-field'>
            <lable required={true} for='email'>Email: </lable>
            <input onChange = {e => {setEmail(e.target.value)}}required={true} type='email' name='email' placeholder='Enter registered email ID' />
        </div>
        <div className='cred-field'>
            <label for='password'>Password: </label>
            <input onChange={e => {setPassword(e.target.value)}} required={true} type='password' name='password' placeholder='Enter Password' />
        </div>
        <button disabled={email !=='' && password !== ''?false: true} style={{margin: 'auto'}} type="submit" class="btn btn-success btn-block" onClick={e => handleLoginClick(e)}>Login to Admin Dash </button>        
        
        {userData === -1 && <div><br/><span className="fail-text">Authentication Failed !!! <b>Retry ...</b></span></div>}
    </form>
    
)}

const LoginPage = () => (
    <div className='login-page-container'>
        <div className='login-box-container'>
        <div className='logo-container'>
            {/* <Logo/> */}
            <img src={pngLogo} width={200} height={200}  alt={'logo'} />
        </div>
        <LoginComponent />
        </div>
    </div>   
)

export {LoginComponent}
export default LoginPage