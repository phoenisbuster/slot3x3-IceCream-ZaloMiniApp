import React, {useRef, useEffect, useState} from 'react';
import {
  Page
} from 'zmp-ui';

import api from "zmp-sdk"
import { FROM, createParentMessage, isChildMessage, GAME_URL } from '../helper';

const HomePage:React.FunctionComponent = () => {
  const IFrameRef = useRef(null);
  const [receivedMsg, setReceivedMsg] = useState("");

  const sendMessage = (msg) => {
    if (!IFrameRef.current) return;
      //@ts-ignore
      IFrameRef.current.contentWindow.postMessage(
        createParentMessage(msg), GAME_URL
      );
  };

  const onReceivedMsg = (e)=>{
    let data = e.data;
    let temp: string = JSON.stringify(data)
    console.log(temp)
    isChildMessage(temp)
    if(temp.includes("Hi"))
      setReceivedMsg(FROM + " =" + e.data);
  }

  useEffect(() => {
    window.addEventListener("message", onReceivedMsg);
  }, []);


  return (
    <Page className="page">
       <iframe  ref={IFrameRef} src={GAME_URL} height="600" width="400"/> 
       <p></p>
       <button type="primary" onClick={() => {
        api.getDeviceIdAsync().then(info=>{sendMessage({"info": info})})
          sendMessage({"test":"testssss"});
        }}>
        send sms to child
      </button>
      <p>{receivedMsg}</p>
    </Page>
  );
}

export default HomePage;