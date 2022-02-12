import Heading from '../components/heading'
import { useState } from 'react';
import { RowHead, RowItem } from '../components/rowItems';
import TabNav from '../components/tabnav';
import SideNav from '../components/sidenav';
{/*

    INPUT DATA : 
        - PAGE HEADER
        - SPACING
        - HEADERS
        - DISPLAY DATA
        - ITEM CLICK HANDLER

        // include active status
*/}

const ListPage = ({ heading, spacing, headers, displayItems, mainData, mainDataClickHandler, topTabs, topTabClickHandler, listOfIDs}) => {

    const styles = {
        main:{
            display:'flex',
            height: '100vh',
            overflow: 'hidden'
        },
    
        container: {
          flex:1, 
          minWidth:'600px',
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

    var keyWords = mainData.map((item) => {return({label: item.keyWords, id: item._id})}).filter((item => item.label !== undefined))

    return (
        <div style={styles.wrapperContainer}>
            <div style={styles.unScrollableContainer}>
                <Heading 
                text={heading}
                searchBarParams={{search: search, setSearch, keyWords: keyWords}}
                
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
        </div>
  );
}



export default ListPage;
