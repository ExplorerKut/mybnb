import {useState,useEffect} from "react"
import {Link} from "react-router-dom"
import {Puff} from 'react-loader-spinner'
import {Message} from './Popup.js'
import { set } from "date-fns"
function Bookings(props){
    const [mybookings,setBookings]=useState([])
    const [spinnerLoading,setSpinnerLoading]=useState(true)
    const [cursor,setCursor]= useState({"next":"","previous":""})
    const [popMessage, setMessage ]= useState({
        "type": "",
        "show": false,
        "message": "",
    });
    useEffect(async()=>{
        let response=await fetch("/api/bookings/",{
            headers:{
                'Authorization':'Bearer '+ props.token
            }
        }).then(response=>{
            
            return response.json()
        }).then(data=>{
            if (data.status === "success") {
                setBookings([...data.data])
                setCursor({"next":data.next_cursor,"previous":""})
                // console.log(mybookings.length)
                setSpinnerLoading(false)
                // showDatePicker()
            } else {
                setSpinnerLoading(false)
                // setMessage({"type":"Error","show":true,"message":"Try Refreshing"})
                // setTimeout(()=>{
                //     setMessage({"type":"","show":false,"message":""})
                // },2000)
            }
        })
        
    },[])
    const nextPage=async (e)=>{
        e.preventDefault()
        const response=await fetch("/api/bookings/"+cursor.next,{
            headers:{
                'Authorization':'Bearer '+ props.token
            }
        })
        .then(response=>{
            return response.json()
    }).then(data=>{
        if (data.status === "success") {
            setBookings([...data.data])
            
            let previous=cursor.next;
            setCursor({"next":data.next_cursor,"previous":data.previous_cursor})
            console.log(cursor)
            setSpinnerLoading(false)
            // showDatePicker()
        } else {
            setSpinnerLoading(false)
            setCursor({"next":data.next_cursor,"previous":data.previous_cursor})
            // setMessage({"type":"Error","show":true,"message":data.message})
            // setTimeout(()=>{
            //     setMessage({"type":"","show":false,"message":""})
            // },2000)
        }
    })

    }
    const previousPage=async (e)=>{

        e.preventDefault()
        if(cursor.previous!==""){
        const response=await fetch("/api/bookings/"+cursor.previous,{
            headers:{
                'Authorization':'Bearer '+ props.token
            }
        })
        .then(response=>{
            return response.json()
    }).then(data=>{
        if (data.status === "success") {
            setBookings([...data.data])
            // let previous=cursor.previous
            setCursor({"next":data.next_cursor,"previous":data.previous_cursor})
            console.log(mybookings)
            setSpinnerLoading(false)
            // showDatePicker()
        } else {
            setSpinnerLoading(false)
            setMessage({"type":"Error","show":true,"message":"refresh"})
            setTimeout(()=>{
                setMessage({"type":"","show":false,"message":""})
            },2000)
            
        }
    })
}
    }
    return(
        <>
            <div className="user-bookings">
            
            <Puff
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                visible={spinnerLoading}
                style=""
            />{ !spinnerLoading&&!mybookings.length==0?
            
            <div className="bookings-content">
            <h1>Your bookings</h1>
            <table className="booking-details">
                <thead>
                <tr>
                <th>Date</th>
                <th>Booking Id</th>
                <th>Property Id</th>
                <th>check in</th>
                <th>check out</th>
                <th>Price</th>
                <th>Status</th>
                </tr>
                </thead>
                <tbody>
                    {
                    mybookings.map((item)=>(
                        <TableRow item={item} key={item.booking_id}/>
                    ))
                    
                    }
                </tbody>
            </table>
            {/* {mybookings.length>5? */}
            <div>
            <button disabled={cursor.previous===""?true:false} className="pagination pagination-previous" onClick={previousPage}>previous</button>
            <button disabled={cursor.next===""?true:false}className="pagination pagination-next" onClick={nextPage}>Next</button>
            </div>
            {/**/}
            </div>
            :!spinnerLoading?<div><h1 className="heading-center-empty">You have Zero bookings</h1>
            <Link to="/" >Go Here to search Locations</Link></div>:null
            
            }
            <Message messageShow={popMessage.show}>
                        <h1>{popMessage.type}</h1>
                        <h2>{popMessage.message}</h2>
            </Message>
            
            </div>
        </>
    )
}
export default Bookings;
export function TableRow(props){
    // console.log(props)
    return(
        <tr>
            <td>{props.item.date}</td>
            <td>{props.item.booking_id}</td>
            <td><Link className="link-components-property" to={"/places/"+props.item.property_location+"/"+props.item.property_id}>{props.item.property_name}</Link></td>
            <td>{props.item.check_in}</td>
            <td>{props.item.check_out}</td>
            <td>{props.item.price}</td>
            <td>Active</td>
        </tr>
    )
}