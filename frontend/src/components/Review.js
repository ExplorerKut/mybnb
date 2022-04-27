import React, { useEffect, useState, useRef } from "react";
import Rating from "@material-ui/lab/Rating"
import  {Message}  from "./Popup.js";
import { Puff } from "react-loader-spinner";
import Star from "../images/star-symbol.svg"
import { formatDistanceStrictWithOptions } from "date-fns/fp";
export default function Review(props){
  
  const [popMessage, setPopMessage ]= useState({
    "type": "",
    "show": false,
    "message": "",
});
    const [message,setMessage]=useState()
    const [ratings,setRatings]=useState({})
    const [ableToReview,permissionToReview]=useState(false)
    const submitReview=async (e)=>{
        let send_data={id:props.id,message:message,ratings:ratings}
        e.preventDefault()
        const response=await fetch("/api/reviews/post",{
          method:"POST",
          headers:{
            "Content-type":"Application/json",
            "Authorization":"Bearer "+props.token
          }
          ,
          body:JSON.stringify(send_data)
        }).then(response=>{
          return response.json()
        }).then(data=>{
          if(data.status==="success"){
           allowReviewing()
          }
          else{
            setPopMessage({"type":"error","show":true,"message":data.message})
            setTimeout(()=>{
                setPopMessage({"type":"","show":false,"message":""})
                // showDatePicker()
            },4000)
          }
        }
        )
    }
    const allowReviewing=(e)=>{
        if(ableToReview==false){
            permissionToReview(true)
        }
        else{
            permissionToReview(false)
        }
    }
    
    
    return(


        <div>
        <hr></hr>
        {/* <button className="dropbtn" onClick={allowReviewing}>Post Your Review</button> */}
        
        
        {ableToReview?
        <div className="show-review">
        <button className="dropbtn" onClick={allowReviewing}>Show Reviews</button>
          <ReviewRating ratings={ratings} setRatings={setRatings}/>
          <ReviewMessage setMessage={setMessage} message={message} id={props.id}/>
          <button onClick={submitReview}>POST</button>
        </div>
        :<ReviewsList id={props.id} allowReviewing={allowReviewing}/>}
        <Message messageShow={popMessage.show}>
              <h1>{popMessage.type}</h1>
              <h2>{popMessage.message}</h2>
        </Message>
        </div>
    )
}
export function ReviewRating(props){
    const [value1, setValue1] = useState(1)
    const [location, setLocation] = useState(1)
    const [cleanliness, setCleanliness] = useState(1)
    const [check_in, setCheckIn] = useState(1)
    const [accuracy, setAccuracy] = useState(1)
    useEffect(()=>{
        props.setRatings({cleanliness:cleanliness,location:location,value1:value1,check_in:check_in,accuracy:accuracy})
    },[])
    return(
      <div>
      <div className="review-container">
      <div className="review">
      <h4>Cleanliness</h4>
      <Rating name="simple-controlled0" value={cleanliness} onChange={(event,newValue)=>{props.setRatings({...props.ratings,cleanliness:newValue});setCleanliness(newValue)}}/>
      </div>
      <div className="review">
      <h4>Location</h4>
      <Rating name="simple-controlled1" value={location} onChange={(event,newValue)=>{props.setRatings({...props.ratings,location:newValue});setLocation(newValue)}}/>
      </div>
      <div className="review">
      <h4>Check In</h4>
      <Rating name="simple-controlled2" value={check_in} onChange={(event,newValue)=>{props.setRatings({...props.ratings,check_in:newValue});setCheckIn(newValue)}}/>
      </div>
      <div className="review">
      <h4>Value</h4>
      <Rating name="simple-controlled3" value={value1} onChange={(event,newValue)=>{props.setRatings({...props.ratings,value1:newValue});setValue1(newValue)}}/>
      </div>
      <div className="review">
      <h4>Accuracy</h4>
      <Rating name="simple-controlled4" value={accuracy} onChange={(event,newValue)=>{props.setRatings({...props.ratings,accuracy:newValue});setAccuracy(newValue)}}/>
      </div>
      </div>
      </div>
    )
  }
  
  export function ReviewMessage(props){
    // const message=useRef()
    // props.setMessage(message.current.value)
    
    return(
      <div className="reviewMessage">
      <textarea value={props.message}  onChange={(event)=>{
          props.setMessage(event.target.value)
      }} rows="5"></textarea>
      {/* <button onClick={submitReview}>POST</button> */}
      </div>
    )
  };

  export function ReviewsList(props){
    const [reviewList,setReviewList]=useState([
      {"cleanliness":0},
      {"accuracy":0},
      {"location":0},
      {"value":0},
      {"check in":0},
    ])
    const [reviewInfo,setReviewInfo]=useState({"reviewAverage":0,"reviewNo":0});
    useEffect(async()=>{
        let response=fetch("/api/reviews/getReviewAverage/"+props.id)
        .then(response=>{
          return response.json()
        }).then(data=>{
          // console.log(data)
          if(data.status=="success"){
            // console.log("hete")
            setReviewList([...data.data[0]])
            setReviewInfo({"reviewAverage":data.data[1],"reviewNo":data.data[2]})
          }
        })
    },[])
    return(
            <div>
            <div className="top-headings-review">
              <img className="review-star-img" src={Star}></img>
              <h2>{reviewInfo.reviewAverage} . </h2>
              <h2>{reviewInfo.reviewNo} Reviews</h2>
              <button className="dropbtn" onClick={props.allowReviewing}>Post Your Review</button>
            </div>
            <div className="review-container">
            {reviewList.map((item)=>(
              Object.keys(item).map((key)=>(
                <ProgressBar key={key} ratingName={key} ratingValue={item[key]}/>
              ))
              
            ))}
            
            </div>
            <ShowReviews  id={props.id}/>
            </div>
    )
  }
  export function ProgressBar(props){
    return(
      
              <div className="review">
              <label className="progress-labels" htmlFor="file">{props.ratingName}</label>
              <progress id="file" max="5" value={props.ratingValue}/>
              
      </div>
    )
  }
  export function ShowReviews(props){
    const [cursor,setCursor]= useState({"next":"","previous":""})
    const [pageReviews,setReviews]=useState([])
    useEffect(async()=>{
      const response=await fetch("/api/reviews/get/"+props.id+"/")
      .then(response=>{
        return response.json()
      }).then(data=>{
        if(data.status==="success"){
          setReviews([...data.data])
          // props.testList=data.reviewAverage
          setCursor({"next":data.next_cursor,"previous":""})
        }
      })
    },[])
    const nextPage=async (e)=>{
      e.preventDefault()
      const response=await fetch("/api/reviews/get/"+props.id+"/"+cursor.next)
      .then(response=>{
          return response.json()
  }).then(data=>{
      if (data.status === "success") {
          setReviews([...data.data])
          let previous=cursor.next;
          setCursor({"next":data.next_cursor,"previous":data.previous_cursor})
          // console.log(cursor)
          // setSpinnerLoading(false)
          // showDatePicker()
      } else {
        setCursor({"next":data.next_cursor,"previous":data.previous_cursor})
          // setMessage({"type":"Error","show":true,"message":"Try Refreshing"})
          // setTimeout(()=>{
          //     setMessage({"type":"","show":false,"message":""})
          // },4000)
      }
  })

  }
  const previousPage=async (e)=>{

      e.preventDefault()
      if(cursor.previous!==""){
      const response=await fetch("/api/reviews/get/"+props.id+"/"+cursor.previous)
      .then(response=>{
          return response.json()
  }).then(data=>{
      if (data.status === "success") {
          setReviews([...data.data])
          // let previous=cursor.previous
          setCursor({"next":data.next_cursor,"previous":data.previous_cursor})
          // console.log(mybookings)
          // setSpinnerLoading(false)
          // showDatePicker()
      } else {
          
          // setMessage({"type":"Error","show":true,"message":"Try refreshing  Again"})
          // setTimeout(()=>{
          //     setMessage({"type":"","show":false,"message":""})
          // },4000)
      }
  })
}
  }
  return(
    <div className="show-review-message">
    
      {pageReviews.map((item)=>(
        <SingleReview item={item} key={item.posted_by}
        />
      ))}
    
    <div>
            <button disabled={cursor.previous===""?true:false} className="pagination pagination-previous" onClick={previousPage}>previous</button>
            <button disabled={cursor.next===""||pageReviews.length<5?true:false} className="pagination pagination-next" onClick={nextPage}>Next</button>
    </div>
    </div>
  )
  }

export function SingleReview(props){
  return(
    <div className="review-message">
      <h4>{props.item.posted_by}</h4>
      <h5>{props.item.posting_date}</h5>
      <hr></hr>
      <span>{props.item.review}</span>
    </div>

  )
}