import {useState,useEffect} from "react"
import {Link} from "react-router-dom"
import {Puff} from 'react-loader-spinner'
function RegisteredProperty(props){
    const [myProperties,setProperty]=useState([])
    const [spinnerLoading,setSpinnerLoading]=useState(true)
    const [cursor,setCursor]= useState({"next":"","previous":""})
    const [popMessage, setMessage ]= useState({
        "type": "",
        "show": false,
        "message": "",
    });
    useEffect(async()=>{
        let response=await fetch("/api/host/getProperty/",{
            headers:{
                'Authorization':'Bearer '+ props.token
            }
        }).then(response=>{
            return response.json()
        }).then(data=>{
            if (data.status === "success") {
                setProperty([...data.data])
                setCursor({"next":data.next_cursor,"previous":""})
                setSpinnerLoading(false)
                // showDatePicker()
            } else {
    
                setMessage({"type":"Error","show":true,"message":"Try Refreshing"})
                setTimeout(()=>{
                    setMessage({"type":"Error","show":true,"message":"Try Refreshing Again"})
                },4000)
            }
        })
        
    },[])
    const nextPage=async (e)=>{
        e.preventDefault()
        const response=await fetch("/api/host/getProperty/"+cursor.next,{
            headers:{
                'Authorization':'Bearer '+ props.token
            }
        })
        .then(response=>{
            return response.json()
    }).then(data=>{
        if (data.status === "success") {
            setProperty([...data.data])
            
            let previous=cursor.next;
            setCursor({"next":data.next_cursor,"previous":data.previous_cursor})
            console.log(cursor)
            setSpinnerLoading(false)
            // showDatePicker()
        } else {

            setMessage({"type":"Error","show":true,"message":"Try Booking  Again"})
            setTimeout(()=>{
                setMessage({"type":"Error","show":true,"message":"Try Booking Again"})
            },4000)
        }
    })

    }
    const previousPage=async (e)=>{

        e.preventDefault()
        if(cursor.previous!==""){
        const response=await fetch("/api/host/getProperty/"+cursor.previous,{
            headers:{
                'Authorization':'Bearer '+ props.token
            }
        })
        .then(response=>{
            return response.json()
    }).then(data=>{
        if (data.status === "success") {
            setProperty([...data.data])
            // let previous=cursor.previous
            setCursor({"next":data.next_cursor,"previous":data.previous_cursor})
            console.log(cursor)
            setSpinnerLoading(false)
            // showDatePicker()
        } else {

            setMessage({"type":"Error","show":true,"message":"Try Booking  Again"})
            setTimeout(()=>{
                setMessage({"type":"Error","show":true,"message":"Try Booking Again"})
            },4000)
        }
    })
}
    }
    return(
        <>
            <div className="user-bookings">
            <h1>Your Properties</h1>
            <Puff
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                visible={spinnerLoading}
                style=""
            />{ !spinnerLoading?
            <div className="bookings-content">
            <table className="booking-details">
                <thead>
                <tr>
                <th>Registeration Date</th>
                <th>Property Id</th>
                <th>Property Name</th>
                <th>Location</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Select <input type="checkbox"></input></th>
                </tr>
                </thead>
                <tbody>
                    {
                    myProperties.map((item)=>(
                        <TableRow token={props.token} item={item} key={item.property_id}/>
                    ))
                    
                    }
                </tbody>
            </table>
            <div>
            <button className="pagination pagination-previous" onClick={previousPage}>previous</button>
            <button className="pagination pagination-next" onClick={nextPage}>Next</button>
            </div>
            </div>
            :null
            
            }
            
            </div>
        </>
    )
}
export default RegisteredProperty;
export function TableRow(props){
    // console.log(props)
    const deleteProperty=async(e)=>{
        const response=await fetch("/api/host/delete/"+props.item.property_id,{
            method:"DELETE",
            headers:{
                Authorization:"Bearer "+props.token
            }
        }).then(response=>{
            return response.json()
        }).then(data=>{
            if(data.status==="success"){
                window.location.reload()
            }
            else{
                window.alert("hie")
            }
        })
    }
    return(
        <tr>
            <td>{props.item.date}</td>
            <td>{props.item.property_id}</td>
            <td><Link className="link-components-property" to={"/places/"+props.item.property_location+"/"+props.item.property_id}>{props.item.property_name}</Link></td>
            <td>{props.item.property_location}</td>
            <td>{props.item.property_type}</td>
            <td>{props.item.price}</td>
            <td>Active</td>
            <td><button class="delete-button" onClick={deleteProperty}>X</button></td>
        </tr>
    )
}