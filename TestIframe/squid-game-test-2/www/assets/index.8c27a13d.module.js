import{r as i,R as n,P as f,a as m,b as p,A as g,S as E,Z as R,c as y,d as h,e as A}from"./vendor.7c8f7862.module.js";const S=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const c of e.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function a(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerpolicy&&(e.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?e.credentials="include":t.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function r(t){if(t.ep)return;t.ep=!0;const e=a(t);fetch(t.href,e)}};S();const M="RLGR_PARENT",P="RLGR_CHILD",u="from",b="data",d="https://cocos.incubator.inspirelab.io/web-mobile-28";function C(s){return{[u]:M,[b]:s}}function v(s){return s!=null&&s[u]==P}const w=()=>{const s=i.exports.useRef(null),[o,a]=i.exports.useState(""),r=e=>{!s.current||s.current.contentWindow.postMessage(C(e),d)},t=e=>{let c=e.data,l=JSON.stringify(c);console.log(l),v(l),l.includes("Hi")&&a(u+" ="+e.data)};return i.exports.useEffect(()=>{window.addEventListener("message",t)},[]),n.createElement(f,{className:"page"},n.createElement("iframe",{ref:s,src:d,height:"600",width:"400"}),n.createElement("p",null),n.createElement("button",{type:"primary",onClick:()=>{m.getDeviceIdAsync().then(e=>{r({info:e})}),r({test:"testssss"})}},"send sms to child"),n.createElement("p",null,o))},L=()=>n.createElement(p,null,n.createElement(g,null,n.createElement(E,null,n.createElement(R,null,n.createElement(y,null,n.createElement(h,{path:"/",element:n.createElement(w,null)})))))),I={title:"squid game test 2",headerColor:"#1843EF",textColor:"white",statusBarColor:"#1843EF",leftButton:"back"},F=!1,N=[],_=[],O=[],x=[];var G={app:I,debug:F,listCSS:N,listSyncJS:_,listAsyncJS:O,pages:x};window.APP_CONFIG||(window.APP_CONFIG=G);const J=A(document.getElementById("app"));J.render(n.createElement(L));
