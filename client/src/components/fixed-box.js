import {useEffect, useRef} from 'react';

const FixedBox = (props) => { 
    const fixedBoxStyle =
        {
            backgroundColor: 'white',
            width: '300px',
            height: '400px',
            borderRadius: '10px',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', 
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            zIndex: 1000,
            overflowY: 'scroll'
        }

    const ref = useRef(null)

    const handleClick = (e) => { 
        if (ref.current && !ref.current.contains(e.target)) {
            props.setBoxStatus(false)
        }
    }

    
    useEffect(() => {
        window.addEventListener('mousedown', (e) => {handleClick(e)});
      
        // returned function will be called on component unmount 
        return () => {
          window.removeEventListener('mousedown', () => {})
        }
      }, [])

    return (
            <div ref={ref} style={fixedBoxStyle}>
                {props.children}
            </div>
    )
}

export default FixedBox;