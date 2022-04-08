import React,{useState} from 'react'
import searchImage from '../images/search (1).png'
import ReactDOM from 'react-dom'
function Search(){
    const [showSearch,setSearch]=useState(false)
    const setSearchVisibility=()=>{
        if(showSearch===false){
            setSearch(true)
        }
        else{
            setSearch(false)
        }
    }
    return(
        <div className="search-bar">
            <input className="search-input" type="text" value="Start Your Search" onClick={setSearchVisibility}  readOnly></input>
            <img src={searchImage}/>
            <div>
            {showSearch?
            <div>
            <form className="location-search">
                <input type="text" value="Location"/>
                <input type="date" value="Location"/>
                <input type="date" value="Location"/>
                
            </form>
            </div>:
            null
            }
            </div>
        </div>   
    )
}
export default Search;