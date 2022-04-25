import React, { useRef } from 'react'

function HostProperty({token}){
    
    let property_name=useRef()
    let property_type=useRef()
    let property_description=useRef()
    let property_address=useRef()
    let property_location=useRef()
    let property_price=useRef()
    const registerProperty=async (e)=>{
        
        let sendData={
            "property_name":property_name.current.value,
            "property_type":property_type.current.value,
            "property_description":property_description.current.value,
            "property_address":property_address.current.value,
            "property_location":property_location.current.value,
            "property_price":property_price.current.value
        }
        // console.log(sendData)
        e.preventDefault()
        
        const response=await fetch("/api/host/addProperty",{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+ token,
            },
            body:JSON.stringify(sendData)
        }).then(response=>{
            return response.json()
        })
        // console.log(response)
        if(response[0]["status"]=="error"){
            window.alert(response["message"])
        }
        else{
            window.alert(response["message"])
        }
        }
    return(
        <div className='property-form'>
            <h2>Add Your Property in a matter of minutes</h2>
            <div className='form-container'>
            <form className="form-details" id="form-detail">
                <div class="form-details-div">
                <label htmlFor="property-name">Name</label>
                <input type="text" name="property-name" className="property-name" ref={property_name}></input>
                <label htmlFor="property-type">Property Type
                </label>
                <select name="property-type" className="property-type" ref={property_type}>
                    <option value="Flat">Flat</option>
                    <option value="House">House</option>
                    <option value="Secondary Unit">Secondary Unit</option>
                    <option value="Bed and Breakfast">Bed and Breakfast</option>
                    <option value="Farm">Farm</option>
                </select>
                </div>
                <label type="property-description">Description</label>
                <input type="text" name="property-description" className='property-description' ref={property_description}></input>
                <label htmlFor="property-location">Location</label>
                <input type="text" name="property-location" className='property-location' ref={property_location}></input>
                <label htmlFor="property-address">Address</label>
                {/* <input type="textarea" name="property-address" className='property-address'></input> */}
                <textarea rows="4" name="address" form="form-details" className='property-address' ref={property_address}></textarea>
                <label type="text" name="property-price">
                    Price Per Night
                </label>
                <input type="text" name="property-price" className="property-price" ref={property_price}></input>
                <button type="submit" form="form-detail" onClick={registerProperty}>Submit</button>
            </form>
            
            </div>
            
        </div>
    )
}
export default HostProperty;
