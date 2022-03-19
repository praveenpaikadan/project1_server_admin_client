import './App.css'
import Dashboard from './dashboard';
import LoginPage from './login-page'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import NotFound from './pages/not-found';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {LoginContext} from './context/loginContext'
import { useState, useEffect } from 'react';
import { getCurrentUserData } from './fetch-handlers/admin-user';
import Loader from './components/loader';


const BASE_URL = 'http://localhost:3567/api/admin'
// const BASE_URL = "https://personal-training-app.herokuapp.com/api/admin"

function App() {

  const [userData, setUserData] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    getCurrentUserData()
    .then((data) => {
      setUserData(data); 
      setLoading(false)
    })
    .catch(err => {
      setLoading(false)
    })
  }, []);

  if(loading){
    return(<Loader position={'center'}/>)
  }
  return (
    <LoginContext.Provider value= {{userData, setUserData}}>
    <BrowserRouter basename='admin'>
      <div class="form-group">
        <ToastContainer />
      </div>

      <Switch>
        <Route path='/' component={LoginPage} exact/>
        <Route path='/login' component={LoginPage} />
        {!userData && <Redirect to='/login' />}
        <Route path='/dashboard' component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
    </LoginContext.Provider>
  );
}

export {BASE_URL}

export default App;

