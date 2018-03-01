/**
 * Created by jiachenpan on 16/11/18.
 */

 export function parseTime(time, cFormat) {
   if (arguments.length === 0) {
     return null;
   }
   const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
   let date;
   if (typeof time == 'object') {
     date = time;
   } else {
     if (('' + time).length === 10) time = parseInt(time) * 1000;
     date = new Date(time);
   }
   const formatObj = {
     y: date.getFullYear(),
     m: date.getMonth() + 1,
     d: date.getDate(),
     h: date.getHours(),
     i: date.getMinutes(),
     s: date.getSeconds(),
     a: date.getDay()
   };
   const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
     let value = formatObj[key];
     if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
     if (result.length > 0 && value < 10) {
       value = '0' + value;
     }
     return value || 0;
   });
   return time_str;
 }

 export function formatTime(time, option) {
   time = +time * 1000;
   const d = new Date(time);
   const now = Date.now();

   const diff = (now - d) / 1000;

   if (diff < 30) {
     return '刚刚'
   } else if (diff < 3600) { // less 1 hour
     return Math.ceil(diff / 60) + '分钟前'
   } else if (diff < 3600 * 24) {
     return Math.ceil(diff / 3600) + '小时前'
   } else if (diff < 3600 * 24 * 2) {
     return '1天前'
   }
   if (option) {
     return parseTime(time, option)
   } else {
     return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
   }
 }
  export function completeDate(time1 , time2 , m)  
{  
    var diffyear = time2.getFullYear() - time1.getFullYear() ;  
    var diffmonth = diffyear * 12 + time2.getMonth() - time1.getMonth() ;  
    if(diffmonth < 0 ){  
        return false ;  
    }  
  
    var diffDay = time2.getDate() - time1.getDate() ;  
  
    if(diffmonth < m || (diffmonth == m && diffDay <= 0)){  
          
        if(diffmonth == m && diffDay == 0){  
            var timeA = time1.getHours()*3600+60*time1.getMinutes()+time1.getSeconds();  
            var timeB = time2.getHours()*3600+60*time2.getMinutes()+time2.getSeconds();  
            if(timeB-timeA > 0){  
                return false;  
            }  
        }  
        return true ;  
    }  
    return false ;  
}  
//把两个时间之间相差的天使
   export function GetDateRegion(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
        var dateSpan,
            tempDate,
            iDays;
        sDate1 = Date.parse(sDate1);
        sDate2 = Date.parse(sDate2);
        dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        return iDays
    };      
//两个时间之间相差的月份都出来
export function getYearAndMonth(start, end) {
    var result = [];
    var starts = start.split('-');
    var ends = end.split('-');
    var staYear = parseInt(starts[0]);
    var staMon = parseInt(starts[1]);
    var endYear = parseInt(ends[0]);
    var endMon = parseInt(ends[1]);
    while (staYear <= endYear) {
        if (staYear === endYear) {
            while (staMon < endMon) {
                staMon++;
                result.push(staMon);
            }
            staYear++;
        } else {
            staMon++;
            if (staMon > 12) {
                staMon = 1;
                staYear++;
            }
            result.push(staMon);
        }
    }

    return result;
}




// 格式化时间
 export function getQueryObject(url) {
   url = url == null ? window.location.href : url;
   const search = url.substring(url.lastIndexOf('?') + 1);
   const obj = {};
   const reg = /([^?&=]+)=([^?&=]*)/g;
   search.replace(reg, (rs, $1, $2) => {
     const name = decodeURIComponent($1);
     let val = decodeURIComponent($2);
     val = String(val);
     obj[name] = val;
     return rs;
   });
   return obj;
 }
 export function datasplit(datas){
	var spi = datas;
	var mpi = spi.split('-')[2];
	return mpi.substr(0, 2);
	
 }


/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
 export function getByteLen(val) {
   let len = 0;
   for (let i = 0; i < val.length; i++) {
     if (val[i].match(/[^\x00-\xff]/ig) != null) {
       len += 1;
     } else { len += 0.5; }
   }
   return Math.floor(len);
 }

 export function cleanArray(actual) {
   const newArray = [];
   for (let i = 0; i < actual.length; i++) {
     if (actual[i]) {
       newArray.push(actual[i]);
     }
   }
   return newArray;
 }

 export function param(json) {
   if (!json) return '';
   return cleanArray(Object.keys(json).map(key => {
     if (json[key] === undefined) return '';
     return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
   })).join('&');
 }

 export function param2Obj(url) {
   const search = url.split('?')[1];
   return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
 }

 export function html2Text(val) {
   const div = document.createElement('div');
   div.innerHTML = val;
   return div.textContent || div.innerText;
 }

 export function objectMerge(target, source) {
    /* Merges two  objects,
     giving the last one precedence */

   if (typeof target !== 'object') {
     target = {};
   }
   if (Array.isArray(source)) {
     return source.slice();
   }
   for (const property in source) {
     if (source.hasOwnProperty(property)) {
       const sourceProperty = source[property];
       if (typeof sourceProperty === 'object') {
         target[property] = objectMerge(target[property], sourceProperty);
         continue;
       }
       target[property] = sourceProperty;
     }
   }
   return target;
 }


 export function scrollTo(element, to, duration) {
   if (duration <= 0) return;
   const difference = to - element.scrollTop;
   const perTick = difference / duration * 10;
   setTimeout(() => {
     console.log(new Date())
     element.scrollTop = element.scrollTop + perTick;
     if (element.scrollTop === to) return;
     scrollTo(element, to, duration - 10);
   }, 10);
 }

 export function toggleClass(element, className) {
   if (!element || !className) {
     return;
   }
   let classString = element.className;
   const nameIndex = classString.indexOf(className);
   if (nameIndex === -1) {
     classString += '' + className;
   } else {
     classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
   }
   element.className = classString;
 }

 export const pickerOptions = [
   {
     text: '今天',
     onClick(picker) {
       const end = new Date();
       const start = new Date(new Date().toDateString());
       end.setTime(start.getTime());
       picker.$emit('pick', [start, end]);
     }
   }, {
     text: '最近一周',
     onClick(picker) {
       const end = new Date(new Date().toDateString());
       const start = new Date();
       start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
       picker.$emit('pick', [start, end]);
     }
   }, {
     text: '最近一个月',
     onClick(picker) {
       const end = new Date(new Date().toDateString());
       const start = new Date();
       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
       picker.$emit('pick', [start, end]);
     }
   }, {
     text: '最近三个月',
     onClick(picker) {
       const end = new Date(new Date().toDateString());
       const start = new Date();
       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
       picker.$emit('pick', [start, end]);
     }
   }]

 export function getTime(type) {
   if (type === 'start') {
     return new Date().getTime() - 3600 * 1000 * 24 * 90
   } else {
     return new Date(new Date().toDateString())
   }
 }

