import React, { useEffect } from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Puff} from 'react-loader-spinner'
// import images from '../../images'
import welcomeImage from '../images/welcome.jpg'
import locationImage from '../images/location.jpeg'
import ReactDOM from 'react-dom'
function Content(){
    const [locations_name,setLocations]=useState([])
    const [spinnerLoading,setSpinnerLoading]=useState(true)
    useEffect(async ()=>{
        const response=await fetch("/locations/")
        .then(response=>{
            return response.json()
        })
        .then(data=>{
            // console.log(data[0]["status"])
            if(data[0]["status"]==="success"){
                setLocations([...data[0].data])
                setSpinnerLoading(false)
            }
        })
    },[])
    return(
        <div className="main-content">
            <div className="WelcomePage">
                <img src={welcomeImage} alt="Welcome"/>
            </div>
            
            <div className="locations">
            <Puff
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                visible={spinnerLoading}
                style=""
            />
                {
                    locations_name.map((items)=>(
                    <Locations items={items} key={items[0]}/>
                )
                )
                }
                {/* <div className="location1">
                    <img src={locationImage} alt="location"></img>
                    <div className="locationName">
                        <span>LocationName</span>
                    </div>
                </div>
                */}
            </div>
            <h3>
            <Link className="link-more" to="searchLocations">Click Here to See more Locations</Link>
            </h3>
        </div>
        
    )
}
export default Content;
export function Locations(props){
    return(
        <Link className="link-components" to={`places/${props.items[0]}`} key={props.items[0]}>
                    <div className="location-city" key={props.items[0]}>
                    <img src={locationImage} alt="location"></img>
                    <div className="locationName">
                        <h3>{props.items[0]}</h3><br/>
                        <h5>has {props.items[1]} properties listed</h5>
                    </div>
                    </div>
        </Link>
    )
}