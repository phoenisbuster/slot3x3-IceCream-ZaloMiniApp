import React, { useRef, useEffect, useState } from "react";
import { Page } from "zmp-ui";

import api from "zmp-sdk";
import {
  FROM,
  createParentMessage,
  isChildMessage,
  GAME_URL,
  EVENT,
  DATA,
  GET_APP_INFO,
  SCAN_QR_CODE,
  LOGIN,
  GET_USER_INFO,
  OA_ID,
  FOLLOW_OA,
  GET_HREF,
  SHARE_LINK,
  ACCESS_TOKEN,
  UPDATE_DEV_VER,
  REQUEST_NOTI,
  DEV_VER,
} from "../helper";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const HomePage: React.FunctionComponent = () => {
  const IFrameRef = useRef(null);
  const [receivedMsg, setReceivedMsg] = useState("");

  const [state, setState] = useState({
    text: "Default",
  });

  const sendMessage = (msg) => {
    if (!IFrameRef.current) {
      console.error("IFrameRef ERROR");
      return;
    }
    //@ts-ignore
    IFrameRef.current.contentWindow.postMessage(msg, GAME_URL);
  };

  const onReceivedMsg = (e) => {
    let temp = e.data;
    let from = temp[FROM];
    let event = temp[EVENT];
    let data = temp[DATA];
    if (!isChildMessage(temp)) return;
    console.log("onReceivedMsg", from, event, data);

    switch (event) {
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
        // followOA();
        break;
      case GET_HREF:
        getHref();
        break;
      case SHARE_LINK:
        share(data);
        break;
      case ACCESS_TOKEN:
        getAccessToken();
        break;
      case UPDATE_DEV_VER:
        updateDevVer();
        break;
      case REQUEST_NOTI:
        requestNotification();
        break;
      default:
        return;
    }
  };

  const updateDevVer = () => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let env = params.get("env");
    let version = params.get("version");

    let dev_ver = "?env=" + env + "&version=" + version;

    console.log(DEV_VER, dev_ver);
    setState({
      text: "DEV_VER: " + dev_ver,
    });

    //@ts-ignore
    let msg = createParentMessage(UPDATE_DEV_VER, dev_ver);
    console.log(msg);
    sendMessage(msg);
  };

  const requestNotification = () => {
    api.requestSendNotification({
      success: () => {
        // xử lý khi gọi api thành công
        console.log(REQUEST_NOTI, true);
        setState({
          text: "REQUEST_NOTI: " + true,
        });

        //@ts-ignore
        let msg = createParentMessage(REQUEST_NOTI, true);
        console.log(msg);
        sendMessage(msg);
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
        setState({
          text:
            "REQUEST_NOTI FAIL: " +
            error.message +
            " " +
            error.code +
            " " +
            error.api,
        });

        //@ts-ignore
        let msg = createParentMessage(REQUEST_NOTI, false);
        console.log(msg);
        sendMessage(msg);
      },
    });
  };

  const getAccessToken = () => {
    api.getAccessToken().then((info) => {
      console.log(info);
      setState({
        text: "TOKEN " + info,
      });
      //@ts-ignore
      let msg = createParentMessage(ACCESS_TOKEN, info);
      sendMessage(msg);
    });
  };

  const getAppInfo = () => {
    api.getAppInfo().then((info) => {
      console.log(info);
      setState({
        text: "APP " + info.appUrl + " " + info.name + " " + info.qrCodeUrl,
      });
      //@ts-ignore
      let msg = createParentMessage(GET_APP_INFO, info);
      sendMessage(msg);
      console.log(msg);
    });
  };

  const login = async () => {
    await api
      .login()
      .then((info) => {
        console.log(info);
        setState({
          text: "LOGIN " + info,
        });
        //@ts-ignore
        let msg = createParentMessage(LOGIN, info);
        console.log(msg);
        sendMessage(msg);
      })
      .catch((error) => {
        console.log("Fail " + error);
        setState({
          text: "LOGIN FAIL " + error,
        });
      });
  };

  const followOA = () => {
    api.followOA({
      id: OA_ID,
      success: () => {
        // xử lý khi gọi api thành công
        setState({
          text: "FOLLOW " + OA_ID,
        });
        //@ts-ignore
        let msg = createParentMessage(FOLLOW_OA, "success");
        console.log(msg);
        sendMessage(msg);
      },
      fail: (err) => {
        // xử lý khi gọi api fail
        setState({
          text: "FOLLOW FAIL " + OA_ID,
        });
        //@ts-ignore
        let msg = createParentMessage(FOLLOW_OA, err);
        console.log(msg);
        sendMessage(msg);
      },
    });
  };

  const getUserInfo = () => {
    api.getUserInfo().then((info) => {
      console.log(info);
      setState({
        text:
          "USER " +
          info.userInfo.id +
          " " +
          info.userInfo.idByOA +
          " " +
          info.userInfo.name +
          " " +
          info.userInfo.isSensitive +
          " " +
          info.userInfo.avatar,
      });
      //@ts-ignore
      let msg = createParentMessage(GET_USER_INFO, info);
      sendMessage(msg);
    });
  };

  const scanQRCode = () => {
    api.scanQRCode({
      success: (data) => {
        // xử lý khi gọi api thành công
        setState({
          text: "SCAN QR " + data.content,
        });
        //@ts-ignore
        let msg = createParentMessage(SCAN_QR_CODE, data);
        console.log(msg);
        sendMessage(msg);
        //{content: '132'}
      },
      fail: (error) => {
        // xử lý khi gọi api thành công
        setState({
          text: "SCAN QR FAIL " + error,
        });
        //@ts-ignore
        let msg = createParentMessage(SCAN_QR_CODE, error);
        console.log(msg);
        sendMessage(msg);
        //{content: ''}
      },
    });
  };

  const getHref = () => {
    setState({
      text: "HREF: " + window.location.href,
    });
    //@ts-ignore
    let msg = createParentMessage(GET_HREF, window.location.href);
    console.log(msg);
    sendMessage(msg);
  };

  const share = (url: string) => {
    api.openShareSheet({
      type: "link",
      data: {
        link: url,
        chatOnly: false,
      },
      success: (data) => {
        setState({
          text: "SHARE " + data.shareType + " " + data.status,
        });
        //@ts-ignore
        let msg = createParentMessage(SHARE_LINK, data);
        console.log(msg);
        sendMessage(msg);
      },
      fail: (err) => {
        setState({
          text: "SHARE FAIL " + err,
        });
        //@ts-ignore
        let msg = createParentMessage(SHARE_LINK, err);
        console.log(msg);
        sendMessage(msg);
      },
    });
  };

  useEffect(() => {
    window.addEventListener("message", onReceivedMsg);
  }, []);

  const { height, width } = useWindowDimensions();
  const iframeHeight = height * 1; // 90% of window height

  return (
    <Page className="page">
      <iframe
        id={"GameIfame"}
        ref={IFrameRef}
        src={GAME_URL}
        height={iframeHeight}
        width={width}
      />
      {/* <button onClick={login}> login </button>
      <button onClick={getAppInfo}> AppInfo </button>
      <button onClick={getUserInfo}> UserInfo </button>
      <button onClick={getHref}> getHref </button>
      <button onClick={scanQRCode}> scanQR </button>
      <button
        onClick={() => {
          share(GAME_URL);
        }}
      >
        {" "}
        share{" "}
      </button>
      <button onClick={getAccessToken}> AccessToken </button>
      <button onClick={updateDevVer}> DevVer </button>
      <button onClick={requestNotification}> Noti </button> */}
      {/* <div> {state.text} </div> */}
    </Page>
  );
};
export default HomePage;

{
  /* <iframe frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        src="https://itch.io/embed-upload/8604634?color=333333"
        allowFullScreen={true}
        width={width} height={height}>
        <a href="https://phoenis.itch.io/slot-zalominiapp">Play Slot-ZaloMiniApp-Demo on itch.io</a>
</iframe > */
}
