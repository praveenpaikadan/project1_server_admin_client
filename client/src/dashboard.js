import SideNav from './components/sidenav'
import ClientDetailsPage from './pages/client-details-page';
import ClientListPage from './pages/client-list-page'
import ProgramPage  from './pages/program-page';
import { Route, Switch, useRouteMatch} from 'react-router-dom';
import Home from './pages/home'
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ProgramListPage from './pages/program-list-page';
import ExerciseListPage from './pages/exercise-list-page';
import LocalPhoneIcon from '@material-ui/icons/LocalPhone';
import NotFound from './pages/not-found';
import ExercisePage from './pages/exercise-page';
import { LoginContext } from './context/loginContext';
import ContactDetails from './pages/contact-details';
import FastFood from '@material-ui/icons/Fastfood';
import { Collections } from '@material-ui/icons';
import DietPlanFormPage from './pages/diet-plan-form';
import DietPlanListPage from './pages/diet-plan-list-page';
import Gallery from './pages/gallery';

const styles = {
    main:{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '100%',
        display:'flex',
        alignItems: 'flex-end',
        overflow: 'scroll',
        margin:0,
        padding:0,
        marginTop: 0,
    },

    container: {
      flex:1, 
      minWidth:'300px',
      flexDirection:'column', 
      boxSizing: 'border-box',
      // padding: '15px',
      height:'100%',
    }
  } 
  

  
function Dashboard() {

  const { userData, setUserData } = useContext(LoginContext)
  const history = useHistory()
  const {path, url}  = useRouteMatch()
  const sideTabs = [
    ['Home', <HomeIcon style={{ fontSize: 25, marginRight:'10px'}} /> , `${url}/home` ],
    ['Clients', <PeopleIcon style={{ fontSize: 25, marginRight:'10px'}} />, `${url}/clients`],
    ['Exercises',<ListAltIcon style={{ fontSize: 25, marginRight:'10px'}} />, `${url}/exercises`],  
    ['Programs', <FitnessCenterIcon style={{ fontSize: 25, marginRight:'10px'}} />, `${url}/programs`],
    ['Contact', <LocalPhoneIcon style={{ fontSize: 25, marginRight:'10px'}} />, `${url}/contact-details`,],
    ['Diets', <FastFood style={{ fontSize: 25, marginRight:'10px'}} />, `${url}/diet-plan`,],
    ['Gallery',<Collections style={{ fontSize: 25, marginRight:'10px'}} />, `${url}/gallery`,]
  ]

    return (
      
      <div style={styles.main}>
        <SideNav tabs={sideTabs}/>
        <div style={styles.container}>
          <Switch>
            <Route path='/dashboard' component={Home} exact/>
            <Route path='/dashboard/home' component={Home} exact/>
            <Route path='/dashboard/clients' component={ClientListPage} exact/>
            <Route path='/dashboard/exercises' component={ExerciseListPage} exact/>
            <Route path='/dashboard/programs' component={ProgramListPage} exact/>
            <Route path='/dashboard/diet-plan' component={DietPlanListPage} exact/>
            <Route path='/dashboard/clients/add' component={NotFound} exact/>
            <Route path='/dashboard/exercises/add' component={ExercisePage} exact/>
            <Route path='/dashboard/programs/add' component={ProgramPage} />
            <Route path='/dashboard/diet-plan/add' component={DietPlanFormPage} exact/>
            <Route path='/dashboard/clients/:id' component={ClientDetailsPage} exact/>
            <Route path='/dashboard/exercises/:id' component={ExercisePage} />
            <Route path='/dashboard/programs/:id' component={ProgramPage} />
            <Route path='/dashboard/diet-plan/:id' component={DietPlanFormPage} />
            <Route path='/dashboard/contact-details' component={ContactDetails} />
            <Route path='/dashboard/contact-details' component={ContactDetails} />
            <Route path='/dashboard/gallery' component={Gallery} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>   
    );
}
  
  export default Dashboard;
  
  