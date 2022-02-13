import Heading from '../components/heading'
import { useState } from 'react';
import { RowHead, RowItem } from '../components/rowItems';
import Loader from '../components/loader';

{/*

    INPUT DATA : 
        - PAGE HEADER
        - SPACING
        - HEADERS
        - DISPLAY DATA
        - ITEM CLICK HANDLER

        // include active status
*/}

const ListPage = ({ heading, spacing, headers, displayItems, mainData, mainDataClickHandler, loading}) => {

    const styles = {
        main:{
            display:'flex',
            height: '100%',
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
            height:'100%'
        },
    
        unScrollableContainer:{
    
        },
    
        scrollableContainer:{
        flex:1,
        overflowY: 'scroll',
        flexGrow:1,
        }
    }

    const [search, setSearch] = useState('')

    return (
        <div style={styles.wrapperContainer}>
            <div style={styles.unScrollableContainer}>
                <Heading 
                text={heading}
                searchBarParams={{search: search, setSearch, keyWords: (mainData || []).map((item) => {return({label: item.keyWords, id: item._id})}).filter((item => item.label !== undefined))}}
                
                />
                {/* <TabNav 
                    tabs={topTabs}
                    topTabClickHandler={topTabClickHandler}
                />         */}

                <RowHead 
                    data={headers}
                    spacing={spacing}
                />
            </div>
            
            {loading
            
                ?

                <Loader position='center'/>

                :

                (mainData?
                    
                    (mainData !== []
                        
                        ?
                    
                        <div style={styles.scrollableContainer}>
                        {mainData.filter(item => (item.keyWords.includes(search) || search.includes(item.keyWords))).map((data, index) => (
                            <RowItem 
                                key={data._id}
                                index={index}
                                data={data}
                                spacing={spacing}
                                mainDataClickHandler = {mainDataClickHandler}
                                displayItems = {displayItems}
                            />
                        ))}
                        </div>
                    
                        : 
                    
                        <div className="center-message">No items to display</div>

                    )

                :
                
                <div className="center-message">Failed to fetch Data. Please try again</div>
            
            )

            }

        </div>
  );
}



export default ListPage;
