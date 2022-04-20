import React, { useEffect,useState } from 'react'
import locationImage from '../images/location.jpeg'
import {useSearchParams,useParams,Link} from 'react-router-dom'
import {Puff} from 'react-loader-spinner'
import {ListProperty} from './Properties'
import ShowMaps from './ShowMaps'
function SearchLocation(props){
    let [listProperties,setProperties]=useState([])
    let [params]=useSearchParams()
    // let {locationName,check_in,check_out}=useParams()
    let locationName=params.get("location")
    let checkin=params.get("checkin")
    let checkout=params.get("checkout")
    const [spinnerLoading,setSpinnerLoading]=useState(true)
    // console.log(locationName)
    useEffect(async()=>{
        // console.log(params.get("location"))
        // let map=new Microsoft.Maps.map("#myMap")
        if(checkin!=undefined){
            checkin=new Date(checkin).getTime()/1000;
        }
        if(checkout!=undefined){
            checkout=new Date(checkout).getTime()/1000;
        }
        let response;
        if(props.token!==null){
            response=await fetch("/api/locations/search?location="+locationName+"&checkin="+checkin+"&checkout="+checkout,{
                headers:{
                    'Authorization':'Bearer '+ props.token
                }
            })
            .then(response=>{
                return response.json()
            })
        }
        else{
        response=await fetch("/api/locations/search?location="+locationName+"&checkin="+checkin+"&checkout="+checkout)
        .then(response=>{
            return response.json()
        })
    }
        if(response[0].status==="success"){
            // console.log("here")
            setSpinnerLoading(false)
            setProperties([...response[0].data])
        }
        else{
            // console.log("nothing")
        }
    },[])
    return(
        // <div className='property-container-location'>
        
        // <div>
        // <div  className="loader-style" style={{textAlign:"center"}}>
        // <Puff
        //         type="Puff"
        //         color="#00BFFF"
        //         height={100}
        //         width={100}
        //         visible={spinnerLoading}
                
        //         // className="loader-style"
        // />
        // </div>
        
        // <h1 style={{visibility:!spinnerLoading?'visible':'hidden'}}>There are {listProperties.length} property available in {locationName.toLowerCase()}</h1>
        //     {listProperties.map((item)=>(
                
        //     <ListProperty item={item} locationName={locationName} key={item.id}/>
        //     ))
        //     }
        // </div>
        // {/* <ShowMaps/> */}
        // </div>
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
        <h1 style={{visibility:!spinnerLoading?'visible':'hidden'}}>There are {listProperties.length} registered property in {locationName.toLowerCase()}</h1>
            {listProperties.map((item)=>(
                
            <ListProperty token={props.token} item={item} locationName={locationName} key={item.id}/>
            ))
            }
        </div>
    )
}
export default SearchLocation;

// export function ListProperty(props){
//     return(
//         <Link className="link-components" to={`/places/${props.locationName}/${props.item.id}`} key={props.item.id}>
//                 <div className="property-details-container" key={props.item.id}>
//                 <img src={locationImage}></img>
//                 <div className="property-location-details">
//                     <h4 className="property-location-type">A {props.item.property_type} in {props.locationName}</h4>
//                     <h3 className="property-location-name">{props.item.name}</h3>
//                     <br></br>
//                     <h4 className='property-location-description'>{props.item.description}</h4>
//                     <h4 className='property-location-address'>{props.item.address}</h4>
//                     <h3 className="property-location-price">Price :{props.item.price} /Night</h3>
//                 </div>
                
//             </div>
//         </Link>
//     )
// }