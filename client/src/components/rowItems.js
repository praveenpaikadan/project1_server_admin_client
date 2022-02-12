import { Link, useRouteMatch } from 'react-router-dom';

const RowHead = ({data, spacing}) => {
    
    const styles= {
        container: {
            display: 'flex',
            width:'100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'no-wrap',
            borderBottom: '2px solid rgba(0,0,0,0.1)',
            boxSizing:'border-box',
            paddingRight: '20px', // 20 to account width of scrolll bar
            paddingLeft: '10px',
            
        },
        heading: {
            whiteSpace: 'noWrap',
            opacity:0.7,
            fontSize: '1em', 
            marginTop: '30px',
            marginBottom: '10px'
        }
    } 
    
    return(
        
        <div style={styles.container} >
            {data.map((item, index) => {
                return(
                    <div key={index} style= {{width: spacing[index]}}>
                        <p style={styles.heading}>{item}</p>
                    </div>
                )
            })}
        </div>
 
    )
}


const RowItem = ({data, spacing, mainDataClickHandler, index, id, displayItems}) => {
    
    const {path, url}  = useRouteMatch()
    const styles= {
        container: {
            display: 'flex',
            width:'100%',
            justifyContent: 'space-between',
            flexWrap: 'no-wrap',
            alignItems: 'center',
            boxSizing:'border-box',
            padding: '10px',
        },
    }

    if(data.active  === true){
        data.active = 'Active'
    }else if(data.active  === false){
        data.active = 'Inactive'
    }



    return(
        <Link to={`${url}/${data._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style= {styles.container} 
        className='rowItemContainer'
        >
            {displayItems.map((item, index) => {
                return(
                    <div key={String(index)} style= {{width: spacing[index]}}>
                        {data[item] ? data[item]: '-N/A-'}
                    </div>
                )
            })}
        </div>
        </Link>
    )
}

export {RowItem, RowHead}