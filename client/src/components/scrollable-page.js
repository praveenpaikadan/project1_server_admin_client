
const ScrollablePage = (props) => {

    const styles = {
        main:{
            display:'flex',
            height: '100vh',
            overflow: 'hidden'
        },
    
        container: {
          flex:1, 
          minWidth:'300px',
          flexDirection:'column',
          boxSizing: 'border-box',
          padding: '15px',
          height:'100vh',
        },
        wrapperContainer:{
            display: 'flex',
            flexDirection: 'column',
            height:'100%',
        },
    
        unScrollableContainer:{
            display:'flex',
            flexDirection: 'column',
            alignItems: 'center'
            
        },
    
        scrollableContainer:{
        flex:1,
        overflowY: 'scroll',
        flexGrow:1,
        }
    }

    return (
        <div style={styles.wrapperContainer}>
            <div style={styles.unScrollableContainer}>
                <h2>{props.heading}</h2>
            </div>

            <div style={styles.scrollableContainer}>
                {props.children}
            </div>
        </div>
  );
}



export default ScrollablePage;
