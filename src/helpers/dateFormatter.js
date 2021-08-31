/**
 * @param {Date} date
 * @returns string
 */
 import { getOrdinalNum } from "./stringFormatter";

 export const formatDateISO8601 = (date) => {
   let d = date;
   if (typeof d !== Date) {
     d = new Date(date);
   }
   let month = "" + (d.getMonth() + 1),
     day = "" + d.getDate(),
     year = d.getFullYear();
 
   if (month.length < 2) month = "0" + month;
   if (day.length < 2) day = "0" + day;
 
   return [year, month, day].join("-");
 };
 
 /**
  * @param {Date} date
  * @returns string
  */
 export const formatHoursAMPM = (date) => {
   let hours = date.getHours(),
     minutes = date.getMinutes(),
     ampm = hours >= 12 ? "PM" : "AM";
 
   hours = hours % 12;
   hours = hours ? hours : 12; // the hour '0' should be '12'
   minutes = minutes < 10 ? "0" + minutes : minutes;
   return hours + ":" + minutes + " " + ampm;
 };
 
 /**
  * @param {Date} date
  * @returns string
  */
 export const formatMonthsOrdinalDay = (date) => {
   return `${formatMonthName(date)} ${getOrdinalNum(date.getDate())}`;
 };
 
 /**
  * @param {Date} date
  * @returns string
  */
 export const formatMonthName = (date) => {
   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 
   return monthNames[date.getMonth()];
 };
 
 /**
  * @param {Date} date
  * @returns string
  */
 export const formatWeeekDayName = (date) => {
   const weekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   return weekDayNames[date.getDay()];
 };
 
 export const getCurrentTimestamp = () => {
   return Math.round(+new Date() / 1000);
 };
 
 export const getTimestampInMins = (mins = 2) => {
   var mins = mins;
   var ddate = new Date();
   return Math.round(+new Date(ddate.getTime() + mins * 60000) / 1000);
 };