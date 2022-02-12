import { Autocomplete, TextField } from "@mui/material";
import SearchBar from "material-ui-search-bar"; 
import { useState } from "react";
import {useRouteMatch, Link} from 'react-router-dom'
const Heading = ({text, searchBarParams}) => {
    
    const {path, url}  = useRouteMatch()

    return(
    <div style={styles.container}>
        <h2 style = {styles.text}>{text}</h2>
        <Link 
        style={{marginLeft: 'auto', marginRight: '20px'}}
        to= {`${url}/add`}
        >
            <button type="submit" class="btn btn-success">{ `Add new ${text.slice(0, text.length - 1)}` }</button>
        </Link>
        {searchBarParams?<Autocomplete
            disablePortal
            // freeSolo={true}
            onChange={(e, v) => {searchBarParams.setSearch((v && v.label)?v.label:'')}}
            id="combo-box-demo"
            options={searchBarParams.keyWords}
            sx={styles.searchBar}
            // sx={{ maxWidth: 300, marginLeft:'auto', marginRight: '60px',marginTop: '40px', marginBottom: '40px',...searchBoxStyle }}
            renderInput={(params) => <TextField fullwidth value={searchBarParams.search} onChange={(e) => {searchBarParams.setSearch(e.target.value)}} {...params} label={`Search ${text}`} />}
        />:null}
    </div>    
    )
}

const styles = {
    container:{
        display: 'flex',
        alignItems:'center',
        justifyContent: 'space-between',
    },
    text:{
        fontSize: "30px",
        fontColor: "black",
        opacity: 0.8,
    },
    searchBar:{
        maxWidth:'500px',
        minWidth:'300px',
        borderRadius: '20px',
    }
}


export default Heading