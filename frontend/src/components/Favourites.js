import React, { useEffect,useState } from 'react'
import locationImage from '../images/location.jpeg'
import heartImage from '../images/red-heart.svg'
import {useSearchParams,useParams,Link} from 'react-router-dom'
import {Puff} from 'react-loader-spinner'
import {Message} from './Popup.js'
import {ListProperty} from './Properties.js'
function Favourites(props){
    const [popMessage, setMessage ]= useState({
        "type": "",
        "show": false,
        "message": "",
    });
    let [listProperties,setProperties]=useState([])
    let {locationName}=useParams()
    const [spinnerLoading,setSpinnerLoading]=useState(true)
    // console.log(locationName)
    useEffect(async()=>{
        let response;
        if(props.token!==null){
            response=await fetch("/api/favourites/getFavourites",{
                headers:{
                    'Authorization':'Bearer '+ props.token
                }
            })
            .then(response=>{
                return response.json()
            }) 
        }
        else{

        response=await fetch("/api/favourites"
        )
        
        .then(response=>{
            return response.json()
        })
    }
        
        if(response[0].status==="success"){
            // console.log("here")
            setSpinnerLoading(false)
            setProperties([...response[0].response])
        }
        else{
            setSpinnerLoading(false)
            // setMessage({"type":response[0].status,"message":response[0].message,"show":true})
            // setTimeout(()=>{
            //     setMessage({"type":"","show":false,"message":""})
            // },4000)
        }
    },[])
    return(
        <div className='property-container'>
        <div  className="loader-style" style={{textAlign:"center"}}>
        <Puff
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                visible={spinnerLoading}
                
                // className="loader-style"
        />
        </div>
        <div>

        </div>
        <h1 style={{visibility:!spinnerLoading&&!listProperties.length==0?'visible':'hidden'}}>You have {listProperties.length} property set as Favourite</h1>
            {listProperties.map((item)=>(
            <ListProperty onDelete={true} token={props.token} item={item} locationName={locationName} key={item.id}/>
            ))
            }
            <Message messageShow={popMessage.show}>
                        <h1>{popMessage.type}</h1>
                        <h2>{popMessage.message}</h2>
            </Message>
        {listProperties.length==0&&!spinnerLoading?<div className="heading-center-empty"><h1 className="heading-center-empty">No Properties added in Favourites</h1>
        <Link to="/" >Go Here to search Locations</Link></div>:null}
        </div>
    )
}

export default Favourites;