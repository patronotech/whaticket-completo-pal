import React from 'react'
import  SoftPhone  from 'react-softphone'
import { WebSocketInterface } from 'jssip';


  const config = {
    domain: '192.168.2.4', // sip-server@your-domain.io
    uri: 'sip:202@192.168.2.4', // sip:sip-user@your-domain.io
    password: 'btelefonia12', //  PASSWORD ,
    ws_servers: 'wss://202@192.168.2.4:8089/ws', //ws server
    sockets: new WebSocketInterface('wss://192.168.2.4:8089/ws'),
    display_name: '202',//jssip Display Name
    websocket_url: 'wss://192.168.2.4:443',
    sip_outbound_ur: 'udp://192.168.2.4:5060',
    debug: true // Turn debug messages on

  };
const setConnectOnStartToLocalStorage =(newValue)=>{
// Handle save the auto connect value to local storage
return true
}
const setNotifications =(newValue)=>{
// Handle save the Show notifications of an incoming call to local storage
return true
}
const setCallVolume =(newValue)=>{
// Handle save the call Volume value to local storage
return true
}
const setRingVolume =(newValue)=>{
// Handle save the Ring Volume value to local storage
return true
}

console.log(setConnectOnStartToLocalStorage)

function SoftPhone() {
  return (
    <div className="SoftPhone">
      <header className="SoftPhone-header">
         <SoftPhone
                     callVolume={33} //Set Default callVolume
                     ringVolume={44} //Set Default ringVolume
                     connectOnStart={false} //Auto connect to sip
                     notifications={false} //Show Browser Notification of an incoming call
                     config={config} //Voip config
                     setConnectOnStartToLocalStorage={setConnectOnStartToLocalStorage} // Callback function
                     setNotifications={setNotifications} // Callback function
                     setCallVolume={setCallVolume} // Callback function
                     setRingVolume={setRingVolume} // Callback function
                     timelocale={'UTC+3'} //Set time local for call history
                   />
      </header>
    </div>
  );
}

export default SoftPhone;