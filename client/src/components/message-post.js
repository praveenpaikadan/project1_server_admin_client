import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateMoment  from '@mui/lab/AdapterMoment';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Checkbox from '@mui/material/Checkbox';
import { Select, InputLabel, FormControlLabel, FormControl, MenuItem } from '@mui/material';
import MultiSelectClientList from  '../major-components/client-select'
import { toast } from 'react-toastify';

const MessagePost  = () => {

    const [message, setMessage] = useState('');
    const [startDate, setStartDate] = useState(''); 
    const [endDate, setEndDate] = useState(''); 
    const [maxCloseNumber, setMaxCloseNumber] = useState('')
    const [closeable, setClosable] = useState(true);
    const [target, setTarget] = useState(0)
    const [clientList, setClientList] = useState([])
    const [loading, setLoading] = useState(false)

    const postMessage = () => {
        toast.success('Succesfully pressed button')
        return
    }
    
    return (
        <div style={styles.messagepostContainer} className='shadow1'> 
           <TextField sx={styles.boxItem} fullWidth multiline value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Message" variant="outlined" />
           <LocalizationProvider dateAdapter={AdapterDateMoment}>
           <DateTimePicker
                renderInput={(props) => <TextField sx={styles.boxItem} {...props} />}
                label="Start Date and time"
                value={startDate}
                onChange={(newValue) => {
                    setStartDate(newValue);
                }}
            />
           </LocalizationProvider>

           <LocalizationProvider dateAdapter={AdapterDateMoment}>
            <DateTimePicker
                    renderInput={(props) => <TextField sx={styles.boxItem} {...props} />}
                    label="End Date and time"
                    value={endDate}
                    onChange={(newValue) => {
                        setEndDate(newValue);
                    }}
                />
           </LocalizationProvider>
           <FormControlLabel
                label="Close-able"
                control={
                <Checkbox
                    sx={styles.boxItem}
                    checked={closeable}
                    onChange={(e) => {setClosable(e.target.checked)} }
                />
                }
            />
           {closeable?<TextField fullWidth type='number' sx={styles.boxItem} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}  multiline value={maxCloseNumber} onChange={(e) => setMaxCloseNumber(e.target.value)} id="outlined-basic" label="Maximum Closes" variant="outlined" />:null}
           <FormControl fullWidth sx={styles.boxItem}>
                <InputLabel id="demo-simple-select-label">Target</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={target}
                    label="Target"
                    onChange={(e) => {setTarget(e.target.value)}}
                >
                    <MenuItem value={0}>All Clients</MenuItem>
                    <MenuItem value={1}>Selected Clients</MenuItem>
                    <MenuItem value={2}>All, except selected clients</MenuItem>
                </Select>
            </FormControl>

            <MultiSelectClientList
                disabled={target === 0}
                label={'Select Clients'}
                setPrivateClients={setClientList}
                dv={[]}
            />
            <button style={{marginTop: '10px'}} onClick={() => postMessage()} class="btn btn-success btn-block">Post Message</button>
        </div>
    )}

const styles = {
    messagepostContainer:{
        width: '300px',
        padding: '20px',
        borderRadius: '5px',
        maxHeight: '85vh',
        overflowY: 'scroll'
    },

    boxItem:{
        margin: '3px'
    }

}


export default MessagePost;