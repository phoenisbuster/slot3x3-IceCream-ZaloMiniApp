import{r as g,R as l,P as F,a as i,b as w,A as G,S as M,Z as k,c as v,d as T,e as H}from"./vendor.5026e51d.module.js";const D=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))d(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const u of n.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&d(u)}).observe(document,{childList:!0,subtree:!0});function f(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function d(o){if(o.ep)return;o.ep=!0;const n=f(o);fetch(o.href,n)}};D();const x="3327045134763932455",U="RLGR_PARENT",J="RLGR_CHILD",m="from",O="event",h="data",I="LOGIN",S="GET_APP_INFO",b="GET_USER_INFO",p="SCAN_QR_CODE",E="FOLLOW_OA",L="GET_HREF",R="SHARE_LINK",N="https://cocos.incubator.inspirelab.io/Demo/Official_web-mobile-5";function c(r=null,s=null){return{[m]:U,[O]:r,[h]:s}}function Q(r){return r!=null&&r[m]==J}const B=()=>{const r=g.exports.useRef(null);g.exports.useState("");const s=t=>{!r.current||r.current.contentWindow.postMessage(t,N)},f=t=>{let e=t.data,a=e[m],A=e[O],_=e[h];if(!!Q(e))switch(console.log("onReceivedMsg",a,A,_),A){case I:o();break;case b:u();break;case S:d();break;case p:y();break;case E:n();break;case L:P();break;case R:C(_);break;default:return}},d=()=>{i.getAppInfo().then(t=>{console.log(t);let e=c(S,t);s(e)})},o=()=>{i.login().then(t=>{let e=c(I,t);console.log(e),s(e)})},n=()=>{i.followOA({id:x,success:t=>{let e=c(E,t);console.log(e),s(e)},fail:t=>{let e=c(E,t);console.log(e),s(e)}})},u=()=>{i.getUserInfo().then(t=>{console.log(t);let e=c(b,t);s(e)})},y=()=>{i.scanQRCode({success:t=>{let e=c(p,t);console.log(e),s(e)},fail:t=>{let e=c(p,t);console.log(e),s(e)}})},P=()=>{let t=c(L,window.location.href);console.log(t),s(t)},C=t=>{i.openShareSheet({type:"link",data:{link:t,chatOnly:!1},success:e=>{let a=c(R,e);console.log(a),s(a)},fail:e=>{let a=c(R,e);console.log(a),s(a)}})};return g.exports.useEffect(()=>{window.addEventListener("message",f)},[]),l.createElement(F,{className:"page"},l.createElement("iframe",{ref:r,src:N,height:"100%",width:"100%"}))},K=()=>l.createElement(w,null,l.createElement(G,null,l.createElement(M,null,l.createElement(k,null,l.createElement(v,null,l.createElement(T,{path:"/",element:l.createElement(B,null)})))))),W={title:"squid game test 2",headerColor:"#1843EF",textColor:"white",statusBarColor:"#1843EF",leftButton:"back"},q=!1,Z=[],j=[],z=[],V=[];var X={app:W,debug:q,listCSS:Z,listSyncJS:j,listAsyncJS:z,pages:V};window.APP_CONFIG||(window.APP_CONFIG=X);const Y=H(document.getElementById("app"));Y.render(l.createElement(K));