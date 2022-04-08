import React, { useEffect,useState } from 'react'
import locationImage from '../images/location.jpeg'
import {useSearchParams,useParams,Link} from 'react-router-dom'
import {Puff} from 'react-loader-spinner'
function Properties(){
    let [listProperties,setProperties]=useState([])
    let {locationName}=useParams()
    const [spinnerLoading,setSpinnerLoading]=useState(true)
    // console.log(locationName)
    useEffect(async()=>{
        const response=await fetch("/api/places/"+locationName)
        .then(response=>{
            return response.json()
        })
        
        if(response[0].status==="success"){
            // console.log("here")
            setSpinnerLoading(false)
            setProperties([...response[0].response])
        }
        else{
            console.log("nothing")
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
        <h1 style={{visibility:!spinnerLoading?'visible':'hidden'}}>There are {listProperties.length} registered property in {locationName.toLowerCase()}</h1>
            {listProperties.map((item)=>(
                
            <ListProperty item={item} locationName={locationName} key={item.id}/>
            ))
            }
        </div>
    )
}
export default Properties;

export function ListProperty(props){
    return(
        <Link className="link-components" to={`/places/${props.locationName}/${props.item.id}`} key={props.item.id}>
                <div className="property-details-container" key={props.item.id}>
                <img src={locationImage}></img>
                <div className="property-location-details">
                    <h4 className="property-location-type">A {props.item.property_type} in {props.locationName}</h4>
                    <h3 className="property-location-name">{props.item.name}</h3>
                    <br></br>
                    <h4 className='property-location-description'>{props.item.description}</h4>
                    <h4 className='property-location-address'>{props.item.address}</h4>
                    <h3 className="property-location-price">Price :{props.item.price} /Night</h3>
                </div>
                
            </div>
        </Link>
    )
}