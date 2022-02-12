import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded"


const BackButton = ({size}) => {
    
    return(
    <div style={{
        marginTop: '60px'
    }}>
        <ArrowBackIosRoundedIcon style={{
            transform: `scale(${size})`,
            border: '1px solid #c7c7c7',
            padding: '3px',
            borderRadius: '50%',
        }}
        className='backButton'

        
        />

        <p style={{marginTop:'60px'}}>Back</p>
    </div>
)}
export default BackButton;