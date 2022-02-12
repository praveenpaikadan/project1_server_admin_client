import { useState } from "react";

const TabNav = ({tabs, topTabClickHandler}) => { 
    const [active, setActive] = useState(0)

    const handleChange = (index) => {
        setActive(index)
        topTabClickHandler(index)
    } 
    
    return(
    <div style={styles.container}>
       {tabs.map((tab, index)=> (
           <h2  key={index} 
                onClick= {()=>handleChange(index)} 
                style={
                    active===index?{
                        ...styles.text,
                    borderBottom: '3px solid orange',
                    opacity: 0.8} :
                    styles.text
                } 
                className="hoverable">
                    {tab}
            </h2>
       ))}
    </div>    
    )
}

const styles = {
    container:{
        minWidth: '500px',
        display: 'flex',
        alignItems:'center',
        justifyContent: 'flex-start',
        borderBottom: '3px solid rgba(0,0,0,0.2)'
    },
    text:{
        fontSize: "20px",
        fontColor: "black",
        opacity: 0.4,
        marginRight: "35px",
        "&:hover": {
            cursor: "pointer"
        }
    },
    textActive:{
        
    }
}


export default TabNav