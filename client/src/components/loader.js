import './loader.css'

const Loader  = ({position}) => {
    
    return (
        <div className = {position?'center':""}>
            <div className="lds-facebook">
                <div></div><div></div><div></div>
            </div>
        </div>
    )}
export default Loader;