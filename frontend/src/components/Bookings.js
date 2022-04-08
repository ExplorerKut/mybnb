import {useState,useEffect} from "react"
import {Puff} from 'react-loader-spinner'
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
        let response=await fetch("/bookings/",{
            headers:{
                'Authorization':'Bearer '+ props.token
            }
        }).then(response=>{
            
            return response.json()
        }).then(data=>{
            if (data.status === "success") {
                setBookings([...data.data])
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
        const response=await fetch("/bookings/"+cursor.next,{
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
        const response=await fetch("/bookings/"+cursor.previous,{
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
            <h1>Your bookings</h1>
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
export default Bookings;
export function TableRow(props){
    // console.log(props)
    return(
        <tr>
            <td>{props.item.date}</td>
            <td>{props.item.booking_id}</td>
            <td>{props.item.property_id}</td>
            <td>{props.item.check_in}</td>
            <td>{props.item.check_out}</td>
            <td>{props.item.price}</td>
            <td>Active</td>
        </tr>
    )
}