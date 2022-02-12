import { SubscriptionsSharp } from '@material-ui/icons';
import {useState} from 'react';

const Subscription = ({setSubscriptionData, dv}) => {

    if(dv){
        dv = dv.map((item) => {item.key = String(Math.random); return item})
    }
        
    const subscriptionOptionShape = () => {return {
        key: String(Math.random()),
        planType: '',
        description:'',
        priceInRs: '',
        paymentReccurence: '',
        forceLock: false
    }}

    var complete = dv.find((item) => item.planType === 'Complete')?true:false

    const [completePlan, setCompletePlan] = useState(complete)

    const [subscriptionOptions, setSubscriptionOptions] = useState(dv?dv:[subscriptionOptionShape()])
    
    const initializeSubscriptionData = () => {
        setSubscriptionData(subscriptionOptions)
    }

    initializeSubscriptionData();

    const handleAddSubscriptionOption = () => {
        var updatedSubscriptionOptions = [...subscriptionOptions ]
        updatedSubscriptionOptions.push(subscriptionOptionShape())
        setSubscriptionOptions(updatedSubscriptionOptions)
        setSubscriptionData(updatedSubscriptionOptions)
    }

    const handleDeleteSubscriptionOption = () => {
        var updatedSubscriptionOptions = [...subscriptionOptions ]
        updatedSubscriptionOptions.pop()
        setSubscriptionOptions(updatedSubscriptionOptions)
        setSubscriptionData(updatedSubscriptionOptions)

    }

    const onDataChange = (index, field, value) => {
        if(index ===0 && completePlan && field ==='planType'){
            return
        }

        if(field ==='planType' && value ==='Complete'){
            return 
        }
        var updatedSubscriptionOptions = [...subscriptionOptions]
        updatedSubscriptionOptions[index][field] = value
        setSubscriptionOptions(updatedSubscriptionOptions)
        setSubscriptionData(updatedSubscriptionOptions);
        //console.log(updatedSubscriptionOptions)
    }

    const [tempStorage, setTempStorage] = useState(false)

    const handleComplete = (status) => {
        console.log(status)
        if(status){setCompletePlan(true)}else{setCompletePlan(false)}

        
        if(status){
            var comp = {...subscriptionOptionShape()}
            var prevState = [...subscriptionOptions]
            comp.planType = 'Complete'
            comp.paymentReccurence = 9999
            comp.forceLock = false
            prevState.unshift(tempStorage?tempStorage:comp)
            setSubscriptionOptions(prevState)
        }else{
            var prevState = [...subscriptionOptions]
            setTempStorage(subscriptionOptions.find(item => item.planType = 'Complete'))
            const findIndex = prevState.findIndex(a => a.planType === 'Complete')
            if(findIndex !== -1){
                prevState.splice(findIndex, 1);
            }
            setSubscriptionOptions(prevState)
        }
    }

    return(
        <fieldset>
            (Uncheck the below box if you dont need to provide a complete package)
            <div>
                <label for="complete">Complete Plan</label>
                <input name='complete' type="checkbox" checked={completePlan} onChange={(e => handleComplete(e.target.checked))}></input>
            </div>
            
            {subscriptionOptions.map((option, index) => {     
                return(
                    <div key={option.key || option._id }>
 
                    <div>
                        <br/>
                        <label>{`Plan Type ${index+1}`}</label>
                        <input  type="textbox" value={option.planType} onChange={e => onDataChange(index, 'planType',e.target.value)}/>
                    </div>

                    <div>
                        <label>Description </label> 
                        <textarea type="text"  value={option.description} onChange={e => onDataChange(index, 'description',e.target.value)}/>
                    </div>

                    <div>
                        <label>Price In INR</label>
                        <input  type='number'  value={option.priceInRs} onChange={e => onDataChange(index,'priceInRs',e.target.value)}/>
                    </div>

                    <div>
                        <label>Payment renews every: </label>
                        <input disabled={option.planType === 'Complete'} value={option.paymentReccurence}  min={1} type='number'  onChange={e => onDataChange(index,'paymentReccurence',e.target.value)}/>
                        &nbsp;<label>days</label>
                    </div>

                    <div>
                        <label>Force block user after due date: </label>
                        <select disabled={option.planType === 'Complete'} value={option.forceLock} onChange={e => onDataChange(index,'forceLock',e.target.value)}>
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                        </select>
                    </div>

                    <br/>
                    </div>
                )
            })}

            <br />
            <div style={{display: 'flex'}}>
            <button class="btn btn-success" onClick={(e) => {e.preventDefault(); return handleAddSubscriptionOption()}}>Add Plan</button>
            &nbsp;
            &nbsp;
            {subscriptionOptions.length >= 2?
            <button class="btn btn-danger" onClick={(e) => {e.preventDefault(); return handleDeleteSubscriptionOption()}}>Delete Last Plan</button>
            :<></>
            }</div>
            <br />

            
        </fieldset>
    )
}

export default Subscription;