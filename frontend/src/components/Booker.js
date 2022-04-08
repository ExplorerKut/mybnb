import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import locationImage from "../images/location.jpeg";
import { DayClickEventHandler, DayPicker, isMatch } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Popup from "./Popup.js";
import  {Message}  from "./Popup.js";
import { Puff } from "react-loader-spinner";
// import { isMatch } from 'date-fns'
function Booker({ token }) {
  const [popMessage, setMessage ]= useState({
    "type": "",
    "show": false,
    "message": "",
});
  // console.log(message[0].show)
  const { locationName, locationId } = useParams();
  const currentMonth = new Date();
  const startofMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  let disabledDayBeforeToday = [{ from: startofMonth, to: currentMonth }];
  let [bookedDays, setBookedDays] = useState([]);
  let [datePicker, setdatePicker] = useState(false);
  const [range, setRange] = useState();
  const [propertyDetails, propertyDetailsSetter] = useState([]);
  let [spinnerLoading, setSpinnerLoading] = useState(true);

  // console.log(locationId)
  let footer = "";
  const handleRange = (range, selectedDay) => {
    setRange(range);

    let loop = new Date(range.from);

    while (loop <= range.to) {
      if (isMatch(loop, [...bookedDays])) {
        // console.log("HeRE")
        setRange();
        break;
      }
      // console.log(loop)
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  };
  const handleDayClick = (day, modifiers, range) => {
    if (modifiers.booked) {
      setRange();
    }
    // setRange(range)
  };

  const today = new Date();
  useEffect(async () => {
    const response = await fetch(
      "/api/places/" + locationName + "/" + locationId
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data)
        if (data[0].status === "success") {
          propertyDetailsSetter([data[0].response]);
          setSpinnerLoading(false);
          // console.log("successfull")
        } else if (data.status === "fail") {
          // console.log(data[0])
        }
      })
      .catch((error) => {
        console.log("Error has occurred while fetching request");
      });
  }, []);
  const showDatePicker = async (e) => {
    if (!datePicker) {
      e.preventDefault();
      const checkAvailability = await fetch(
        "/api/places/" + locationName + "/" + locationId + "/check"
      ).then((response) => {
        return response.json();
      });
      if (checkAvailability.Availability != null) {
        checkAvailability.Availability = checkAvailability.Availability.map(
          (item) => ({ from: new Date(item.from), to: new Date(item.to) })
        );
        setBookedDays([...checkAvailability.Availability]);
      }

      setRange();
      setdatePicker(true);
    } else {
      setRange();
      setdatePicker(false);
    }
  };
  const sendBookRequest = async (e) => {
    e.preventDefault();
    console.log(propertyDetails[0]);
    let sendData = {

      host_id: propertyDetails[0].host_id,
      id: propertyDetails[0].id,
      price: propertyDetails[0].price,
      booking_date: currentMonth,
      check_in: range.from,
      check_out: range.to,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    const response = await fetch(
      "/api/places/" + locationName + "/" + locationId + "/book",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(sendData),
      }
    )
      .then((response) => {
        // console.log
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
            setMessage({"type":"Success","show":true,"message":"Successfully booked"})
            setTimeout(()=>{
                setMessage({"type":"Success","show":false,"message":"Successfully booked"})
                showDatePicker()
            },4000)
            // showDatePicker()
        } else {

            setMessage({"type":"Error","show":true,"message":"Try Booking  Again"})
            setTimeout(()=>{
                setMessage({"type":"Error","show":true,"message":"Try Booking Again"})
                showDatePicker()
            },4000)
            showDatePicker()
        }
      });
  };

  return (
    <>
      <div className="booker-loader" style={{ textAlign: "center" }}>
        <Puff
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          visible={spinnerLoading}
          // className="loader-style"
        />
      </div>
      {propertyDetails.map((item) => (
        <div className="booking-property-container" key={item.id}>
          <div className="booking-property-details">
            <h2>{item.name}</h2>
            <h3>{item.address}</h3>
          </div>
          <div className="booking-property-photos">
            <img src={locationImage}></img>
            <img src={locationImage}></img>
            <img src={locationImage}></img>
            <img src={locationImage}></img>
          </div>

          <div className="booking-property-owner-date">
            <div className="booking-property-owner">
              <h3>Unit hosted by {item.host_id}</h3>
              <hr></hr>
              <h4>{item.description}</h4>
            </div>
            <div className="booking-property-date">
              <button
                className="booking-check-availability"
                type="button"
                onClick={showDatePicker}
              >
                Check Availability
              </button>

              {datePicker && (
                <DayPicker
                  mode="range"
                  disabled={disabledDayBeforeToday}
                  fromMonth={currentMonth}
                  // toDate={thisMonth+2}
                  selected={range}
                  modifiers={{ booked: bookedDays }}
                  modifiersStyles={{
                    booked: {
                      border: "2px solid currentcolor",
                      backgroundColor: "",
                      margin: "0.5px",
                    },
                  }}
                  onSelect={handleRange}
                  // initialMonth={new Date(2022,2,25)}
                  onDayClick={handleDayClick}
                  footer={footer}
                  // selectedDays={selectedDay}
                />
              )}
              {range !== undefined ? (
                token != null || token != undefined ? (
                  <button
                    className="booking-check-availability"
                    type="button"
                    onClick={sendBookRequest}
                  >
                    Book
                  </button>
                ) : (
                  <h4>Login to Book</h4>
                )
              ) : null}
            </div>
           
          </div>
            
        </div>
      ))}
      <Message messageShow={popMessage.show}>
              <h1>{popMessage.type}</h1>
              <h2>{popMessage.message}</h2>
      </Message>
    </>
  );
}
export default Booker;
