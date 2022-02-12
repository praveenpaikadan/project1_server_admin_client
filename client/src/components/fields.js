
const TextField = ({label, name, register, errors, required=true, number=false, dv} ) => {
    return(<div>
        <label>{label}</label>
        <input name={name} defaultValue={dv?dv:""} type={number?'number':''} {...register(name, { required: required })} />
        <span>{errors[name]?"Required Field":""}</span>
    </div>)
}

const OptionField = ({label, name, register, errors, required=true, options, onChange, value, dv}) => {
    
    return(            
    <div>
        <label>{label}</label>
        <select required name={name} defaultValue={dv} {...register(name, { required: required })} onChange={e => {return onChange? onChange(e.target.value):false}}>
            {options.map((option, index) => (
                <option value={value?value[index]:option}>{option}</option>    
            ))}
        </select>
        <span>{errors[name]?"Required Field":""}</span>
    </div>)
}

const MultiSelectField = ({label, name, register, errors, required=true, options}) => {
    return (
        <div>
            <label>{label}</label>
            <fieldset>
                {options.map((option,index) => {
                    return(
                    <>
                    <input type="checkbox" name={`${name}-${index+1}`} value={option} {...register(name, { required: false })} /> &nbsp;
                    <label for={option}>{option}</label>&nbsp;&nbsp;&nbsp;
                    </>
                    )
                })}
            </fieldset>
        </div>
    )
}

const MultiTextField = ({label, name, register, errors, required, options, dv }) => {
    return(
    <div>
        <label>{label}</label>
        <textarea name={name} defaultValue={dv?dv:""} {...register(name, { required: required })} />
        <span>{errors[name]?"Required Field":""}</span>
    </div>)
}

const OtherField = (props) => {
    return (
        <div>
            <label>{props.label}</label>
            {props.children}
        </div>
    )
}

export {TextField, MultiTextField, MultiSelectField, OptionField, OtherField}