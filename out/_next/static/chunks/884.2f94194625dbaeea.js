(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[884],{95853:function(t,e,r){var n;"undefined"!=typeof self&&self,t.exports=(n=r(86006),function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,r){"use strict";function n(){return(n=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t}).apply(this,arguments)}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(e,"__esModule",{value:!0}),r.d(e,"HighchartsReact",function(){return l});var i=r(1),c=r.n(i),s="undefined"!=typeof window?i.useLayoutEffect:i.useEffect,l=Object(i.memo)(Object(i.forwardRef)(function(t,e){var r=Object(i.useRef)(),l=Object(i.useRef)(),u=Object(i.useRef)(t.constructorType),f=Object(i.useRef)(t.highcharts);return s(function(){function e(){var e=t.highcharts||"object"===("undefined"==typeof window?"undefined":a(window))&&window.Highcharts,n=t.constructorType||"chart";e?e[n]?t.options?l.current=e[n](r.current,t.options,t.callback):console.warn('The "options" property was not passed.'):console.warn('The "constructorType" property is incorrect or some required module is not imported.'):console.warn('The "highcharts" property was not passed.')}if(l.current){if(!1!==t.allowChartUpdate){if(t.constructorType!==u.current||t.highcharts!==f.current)u.current=t.constructorType,f.current=t.highcharts,e();else if(!t.immutable&&l.current){var n,i;(n=l.current).update.apply(n,[t.options].concat(function(t){if(Array.isArray(t))return o(t)}(i=t.updateArgs||[!0,!0])||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(i)||function(t,e){if(t){if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(t,e):void 0}}(i)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()))}else e()}}else e()},[t.options,t.allowChartUpdate,t.updateArgs,t.containerProps,t.highcharts,t.constructorType]),s(function(){return function(){l.current&&(l.current.destroy(),l.current=null)}},[]),Object(i.useImperativeHandle)(e,function(){return{get chart(){return l.current},container:r}},[]),c.a.createElement("div",n({},t.containerProps,{ref:r}))}));e.default=l},function(t,e){t.exports=n}]))},36884:function(t,e,r){"use strict";r.r(e);var n=r(9268),o=r(57321),a=r(82805),i=r(56008),c=r(86006),s=r(70179),l=r(10408),u=r.n(l),f=r(95853),p=r.n(f),d=r(76185);e.default=t=>{let e,r,l,{getExpiryDate:f,data1:h,filterType:y,rangeValue:b,volatilityValue:g,updatedRange:m,Breakeven:v}=t,w=(0,c.useMemo)(()=>{let t=null==v?void 0:v.split(","),e=null==t?void 0:t.map(t=>({color:"#1b9fdf",width:2,value:null==t?void 0:t.replace("$",""),zIndex:4,label:{text:"$ ".concat(t),align:"center",verticalAlign:"top",style:{color:"#1b9fdf",fontWeight:"bold"},y:25}}));return Array.isArray(e)?e:[]},[v]),x=(0,o.T)(),T=(0,o.C)(t=>{var e;return null===(e=t.allStrategies)||void 0===e?void 0:e.strategies}),O=(0,i.useSearchParams)(),j=O.get("q");(0,c.useEffect)(()=>{j&&x((0,a.Tu)(j))},[j,x]);let S=new s.Z(T,y);if(T){var C;let t=null==T?void 0:null===(C=T.legs)||void 0===C?void 0:C.map(t=>new Date(null==t?void 0:t.expiration));if(t&&t.length>0){let e=new Date(Math.min(...t));r=(0,d.wT)(e)}}r&&(e=new Date(r)),e&&(l=new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds())).setHours(16,0,0,0),S.setChartRange(b);let A=S.getDataForSelectedDate(l),k=Object.entries(A).map(t=>{let[e,r]=t;return{x:Number(e),y:r}}),I=k.sort((t,e)=>t.x-e.x),P=t=>{let e=Math.abs(parseInt(t)),r=0>parseInt(t)?"-$"+e:"$"+e;return r},U={chart:{animation:!1,type:"area",height:window.innerWidth<767?"400px":"".concat(9/24*100,"%")},title:{text:""},plotOptions:{area:{lineWidth:0}},series:[{name:"Stocks",type:"area",height:100,data:I,marker:{symbol:"circle",radius:0},pointStart:Date.UTC(2023,0),pointInterval:2592e6,color:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#0b9321"],[1,u().color("#0b9321").setOpacity(.5).get("rgba")],[2,u().color("#0b9321").setOpacity(0).get("rgba")]]},negativeColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#d93f3f"],[1,u().color("#d93f3f").setOpacity(.5).get("rgba")],[2,u().color("#d93f3f").setOpacity(0).get("rgba")]]}}],xAxis:{labels:{formatter:function(){return P(this.value)}},crosshair:{width:1,color:"#a4a1a1",dashStyle:"longdash"},plotLines:[{color:"#999999",width:2,value:(null==h?void 0:h.currentPrice)||0,zIndex:4,dashStyle:"dot"},...w]},yAxis:{title:{text:"Profit/Loss"},labels:{formatter:function(){return P(this.value)}},lineColor:"#000000",lineWidth:1,minorGridLineWidth:0,minorTickInterval:"auto",minorTickLength:5,minorTickWidth:1,crosshair:{width:1,color:"#a4a1a1",dashStyle:"longdash"},tickAmount:12,plotLines:[{color:"#999999",width:2,value:0,zIndex:4}]},tooltip:{useHTML:!0,formatter:function(){let t='\n          <div class="custom-tooltip">\n            <span class="custom-tooltipY">P&L '.concat(P(this.y.toFixed(1)),'</span>\n            <span  class="stockPrice">UL Stock ').concat(P(this.x),"</span>\n          </div>\n      ");return t}}};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)("div",{id:"chart-timeline",children:(0,n.jsx)(p(),{highcharts:u(),options:U})})})}}}]);