import React, { useEffect,useState } from 'react'
import locationImage from '../images/location.jpeg'
import heartImage from '../images/red-heart.svg'
import {useSearchParams,useParams,Link} from 'react-router-dom'
import {Puff} from 'react-loader-spinner'
import {Message} from './Popup.js'
function Properties(props){
    let [listProperties,setProperties]=useState([])
    let {locationName}=useParams()
    const [spinnerLoading,setSpinnerLoading]=useState(true)
    // console.log(locationName)
    if(locationName==undefined){
        locationName=""
    }
    useEffect(async()=>{
        let response;
        if(props.token!==null){
            
            response=await fetch("/api/places/"+locationName,{
                headers:{
                    'Authorization':'Bearer '+ props.token
                }
            })
            .then(response=>{
                return response.json()
            }) 
        }
        else{
        response=await fetch("/api/places/"+locationName
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
        <div>

        </div>
        {locationName!=undefined?
        <h1 style={{visibility:!spinnerLoading?'visible':'hidden'}}>There are {listProperties.length} registered property in {locationName.toLowerCase()}</h1>:null
        }
            {listProperties.map((item)=>(
                
            <ListProperty token={props.token} item={item} locationName={locationName} key={item.id}/>
            ))
            }
        </div>
    )
}
export default Properties;

export function ListProperty(props){
    const [isClicked,setClick]=useState(false)
    const [popMessage, setMessage ]= useState({
        "type": "",
        "show": false,
        "message": "",
    });
    useEffect(()=>{
        if(props.item.favourite){
            setClick(true)
        }
        else{
            setClick(false)
        }
    },[])
    
    const onButtonClick=async (e)=>{
        e.preventDefault();
        if(isClicked==true){
            let response=fetch("/api/favourites/removeFavourite/"+props.item.id,{
                method:'DELETE',
                headers:{
                    "Authorization":"Bearer "+props.token
                }
            }).then(response=>{
                return response.json()
            }).then(data=>{
                console.log(data)
                if(data[0].status==="success"){
                    setClick(false)
                    if(props.onDelete==true){
                        window.location.reload()
                    }
                }
                else{
                    setMessage({"type":data[0].status,"message":data[0].message,"show":true})
                    setTimeout(()=>{
                        setMessage({"type":"Success","show":false,"message":"Successfully booked"})
                    },4000)
                }
            })
            
            // setClick(false)
        }
        else{
            if(props.token!=null){
            let send_data={"property_id":props.item.id}
            const response=fetch("/api/favourites/setFavourite",{
                method:"POST",
                headers:{
                    "Content-type":"Application/json",
                    "Authorization":"Bearer "+props.token
                },
                body:JSON.stringify(send_data)
            }).then(response=>{
                return response.json()
            }).then(data=>{
                console.log(data)
                if(data[0].status==="success"){
                    setClick(true)
                }
                else{
                    setMessage({"type":data[0].status,"message":data[0].message,"show":true})
                    setTimeout(()=>{
                        setMessage({"type":"Success","show":false,"message":"Successfully booked"})
                    },4000)
                }
            })
            }
            else{
                setMessage({"type":"Not Authorized","message":"Pleases Login First","show":true})
                    setTimeout(()=>{
                        setMessage({"type":"Success","show":false,"message":""})
                    },2000)
            }
        }
    }
    return(
                <div className="property-details-container" key={props.item.id}>
                <Link className="link-components" to={`/places/${props.item.location}/${props.item.id}`} key={props.item.id}>
                <img src={locationImage}></img>
                </Link>
                <div className="property-location-details">
                
                <button className="favourite-button" onClick={onButtonClick} value={props.item.id}> <img className={`${isClicked||props.item.favourite?"favourite-svg-click":"favourite"}`} src={heartImage}/></button>
                
                <Link className="link-components anchor-div-flex" to={`/places/${props.item.location}/${props.item.id}`} key={props.item.id}>
                    <h4 className="property-location-type">A {props.item.property_type} in {props.item.location}</h4>
                    <h3 className="property-location-name">{props.item.name}</h3>
                    <br></br>
                    <h4 className='property-location-description'>{props.item.description}</h4>
                    <h4 className='property-location-address'>{props.item.address}</h4>
                    <h3 className="property-location-price">Price :{props.item.price} /Night</h3>
                </Link>
                </div>
                <Message messageShow={popMessage.show}>
                        <h1>{popMessage.type}</h1>
                        <h2>{popMessage.message}</h2>
                </Message>
            </div>
    )
}