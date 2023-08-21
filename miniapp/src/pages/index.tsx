import React, {useRef, useEffect, useState} from 'react';
import {
  Page
} from 'zmp-ui';

import api from "zmp-sdk"
import { FROM, createParentMessage, isChildMessage, GAME_URL, EVENT, DATA, GET_APP_INFO, SCAN_QR_CODE, LOGIN, GET_USER_INFO, OA_ID, FOLLOW_OA, GET_HREF, SHARE_LINK } from '../helper';

const HomePage:React.FunctionComponent = () => {
  const IFrameRef = useRef(null);
  const [receivedMsg, setReceivedMsg] = useState("");

  const sendMessage = (msg) => {
    if (!IFrameRef.current) return;
      //@ts-ignore
      IFrameRef.current.contentWindow.postMessage(
        msg, GAME_URL
      );
  };

  const onReceivedMsg = (e)=>{
    let temp = e.data
    let from = temp[FROM]
    let event = temp[EVENT]
    let data = temp[DATA]
    if(!isChildMessage(temp)) return;
    console.log("onReceivedMsg", from, event, data)

    switch(event){
      case LOGIN:
        login();
        break;
      case GET_USER_INFO:
        getUserInfo();
        break;
      case GET_APP_INFO:
        getAppInfo();
        break;
      case SCAN_QR_CODE:
        scanQRCode();
        break;
      case FOLLOW_OA:
        followOA();
        break;
      case GET_HREF:
        getHref();
        break;
      case SHARE_LINK:
        share(data);
        break;
      default: return;
    }
  }

  const getAppInfo = ()=>{ 
    api.getAppInfo().then(info => {
      console.log(info)
      //@ts-ignore
      let msg = createParentMessage(GET_APP_INFO, info)
      sendMessage(msg);
    });
  }

  const login = ()=>{ 
    api.login().then(info => {
      //@ts-ignore
      let msg = createParentMessage(LOGIN, info)
      console.log(msg)
      sendMessage(msg);
    });
  }
  
  const followOA = ()=>{ 
    api.followOA({
      id: OA_ID,
      success: (data) => {
          // xử lý khi gọi api thành công
          //@ts-ignore
          let msg = createParentMessage(FOLLOW_OA, data)
          console.log(msg)
          sendMessage(msg);
      },
      fail: (err) => {
          // xử lý khi gọi api fail
          //@ts-ignore
          let msg = createParentMessage(FOLLOW_OA, err)
          console.log(msg)
          sendMessage(msg);
      }
    });
  }

  const getUserInfo = ()=>{ 
    api.getUserInfo().then(info => {
      console.log(info)
      //@ts-ignore
      let msg = createParentMessage(GET_USER_INFO, info)
      sendMessage(msg);
    });
  }

  const scanQRCode = ()=>{ 
    api.scanQRCode({
      success: (data) => {
        // xử lý khi gọi api thành công
          //@ts-ignore
        let msg = createParentMessage(SCAN_QR_CODE, data)
        console.log(msg)
        sendMessage(msg);
        //{content: '132'}
      },
      fail: (error) => {
       // xử lý khi gọi api thành công
        //@ts-ignore
        let msg = createParentMessage(SCAN_QR_CODE, error)
        console.log(msg)

        sendMessage(msg);
        //{content: ''}
      }
    })
  }

  const getHref = ()=>{ 
   
    //@ts-ignore
    let msg = createParentMessage(GET_HREF, window.location.href)
    console.log(msg)

    sendMessage(msg);
  }

  const share = (url: string)=>{ 
    api.openShareSheet({
      type: 'link',
      data: {
        link: url,
        chatOnly: false
      },
      success: (data) => {
         //@ts-ignore
        let msg = createParentMessage(SHARE_LINK, data)
        console.log(msg)
        sendMessage(msg);
      },
      fail: (err) => {
          //@ts-ignore
          let msg = createParentMessage(SHARE_LINK, err)
          console.log(msg)
          sendMessage(msg);
      }
    });
  }

  useEffect(() => {
    window.addEventListener("message", onReceivedMsg);
  }, []);


  return (
    <Page className="page">
       <iframe  ref={IFrameRef} src={GAME_URL} height="100%" width="100%"/> 
       {/* <p></p>  
       <button type="primary" onClick={() => {
          // getAppInfo()
          login()
          // getHref()
        }}>
        send sms to child
      </button>
      <p>{receivedMsg}</p> */}
    </Page>
  );
}

export default HomePage;