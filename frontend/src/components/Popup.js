import ReactDOM from "react";
import {useState,useEffect} from "react";
import Login from "./Login"
import Properties from "./Properties";
function Popup({role,setRole,onClose=false,show=false,token, removeToken,setToken}){
// function Popup(props){

    
    const [visible, setVisibility] = useState(false);
    const closeHandler = (e) => {
      setVisibility(false);
        onClose(false);
    };
  
    useEffect(() => {
      setVisibility(show);
      // console.log(children)
    }, [show]);
  
    return (
      <div
        style={{
          visibility: visible? "visible" : "hidden",
          opacity: visible ? "1" : "0"
        }}
        className="overlay"
      >
        <div className="popup">
          
          <span className="close" onClick={closeHandler}>
            &times;
          </span>
          <Login visible={visible} role={role} setRole={setRole} setVisibility={setVisibility} setToken={setToken} token={token} removeToken={removeToken}/>
          
        </div>
      </div>
    );
  };

export function Message(props){
  const [visibleMessage, setMessageVisibility] = useState(false);
  useEffect(() => {
    setMessageVisibility(props.messageShow);
  }, [props.messageShow]);

  return (
    <div
      style={{
        visibility: visibleMessage? "visible" : "hidden",
        opacity: visibleMessage ? "1" : "0"
      }}
      className="overlay"
    >
      <div className="popup">
        
        <div className="messageContent">{props.children}</div>
      </div>
    </div>
  );
}
export default Popup;