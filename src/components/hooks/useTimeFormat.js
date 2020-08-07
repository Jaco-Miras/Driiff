/* eslint-disable no-unused-vars */
import moment from "moment-timezone";
import { useSettings } from "./index.js";

const useTimeFormat = () => {
  const {
    generalSettings: { timezone, date_format, time_format },
  } = useSettings();

  const timelineFormat = (date) => {
    return moment(date).calendar(null, {
      nextDay: "[Tomorrow] - MMMM DD, YYYY",
      sameDay: "[Today] - dddd MMMM DD, YYYY",
      lastDay: "[Yesterday] - dddd MMMM DD, YYYY",
      lastWeek: "dddd MMMM DD, YYYY",
    });
  };

  const startOfByDayFormat = (date) => {
    return moment(date).startOf("day").format();
  };

  const timeByHalfFormat = (date) => {
    return moment(date).format("LT");
  };

  const timeDateStringFormat = (date) => {
    return moment(date).format("MMMM DD, YYYY LT");
  };

  const dateStringFormat = (date) => {
    return moment(date).format("MMMM DD, YYYY");
  };

  const dateMonthDayFormat = (date) => {
    return moment(date).format("MMM DD");
  };

  const dateMonthDayYearFormat = (date) => {
    return moment(date).format("MMM DD, YYYY");
  };

  const diffInDays = (date) => {
    return moment().diff(date, "days");
  };

  const diffInTime = (date) => {
    return moment().diff(date, "minutes");
  };

  const diffInMinutes = (date) => {
    return moment().diff(date, "minutes");
  };

  const diffInMinutesLocal = (date) => {
    var utc = moment.utc(date).toDate();
    var local = moment(utc).tz(timezone);
    return diffInMinutes(local);
  };

  const diffInHoursLocal = (timestamp) => {
    var utc = moment(timestamp, "X").toDate();
    var local = moment(utc).tz(timezone);
    return moment().diff(local, "hours");
  };

  const currentDate = (date) => {
    return moment(date);
  };

  const localizeDateDiffLocal = (date) => {
    return moment(date).calendar(null, {
      sameDay: "[Today], MMM DD[,] YYYY hh:mm A",
      lastDay: "[Yesterday], MMM DD[,] YYYY hh:mm A",
      lastWeek: "dddd, MMM DD[,] YYYY hh:mm A",
      sameElse: "MMM DD[,] YYYY hh:mm A",
    });
  };

  const localizeDate = (timestamp, dateFormat = `${date_format} ${time_format}`) => {
    var utc = moment(timestamp, "X").toDate();
    var local = moment(utc).tz(timezone);
    return local.format(dateFormat);
  };

  const localizeTime = (timestamp, timeFormat = `${time_format}`) => {
    var utc = moment(timestamp, "X").toDate();
    var local = moment(utc).tz(timezone);
    return local.format(timeFormat);
  };

  const localizeChatTimestamp = (timestamp, dateFormat = `${date_format} ${time_format}`) => {
    var utc = moment(timestamp, "X").toDate();
    var local = moment(utc).tz(timezone);
    let currentDate = moment().format("l");
    let yesterday = yesterdayDate();
    if (currentDate === local.format("l")) {
      return "Today";
    } else if (yesterday === moment(utc).date()) {
      return "Yesterday";
    } else {
      return local.format(dateFormat);
    }
  };
  const localizeChatChannelDate = (timestamp) => {
    const dateString = moment.unix(timestamp).format("l");
    const currentDate = moment().format("l");
    const rd = new Date(dateString);
    const replyRD = rd.getDate();
    //let replyWeekRD = moment(rd).week()
    let yesterday = yesterdayDate();
    //let weekDate = new Date();
    //let thisWeek = moment(weekDate).week()

    if (dateString === currentDate) {
      return localizeDate(timestamp, time_format);
    } else if (replyRD === yesterday) {
      return "Yesterday";
    } else if (diffInDays(rd) <= 6) {
      return localizeDate(timestamp, "dddd");
    }
    // else if (replyWeekRD === thisWeek){
    //     return localizeDate(timestamp, 'dddd')
    // }
    else {
      return localizeDate(timestamp, date_format);
    }
  };

  const yesterdayDate = () => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getDate();
  };

  const todayOrYesterdayDate = (timestamp) => {
    const utc = moment(timestamp, "X").toDate();
    const local = moment(utc).tz(timezone);
    const hours = moment().diff(moment(utc), "hours");

    if (hours < 24) {
      return moment().calendar().substring(0, moment().calendar().indexOf(" ")) + ", " + local.format(time_format);
    } else if (hours < 48) {
      return moment().subtract(1, "days").calendar().substring(0, moment().subtract(1, "days").calendar().indexOf(" ")) + ", " + local.format(time_format);
    } else {
      return local.format(`dddd[,] ${time_format}`);
    }
  };

  const fromNow = (timestamp) => {
    var utc = moment(timestamp, "X").toDate();
    var local = moment(utc).tz(timezone);
    return local.fromNow();
  };

  return {
    fromNow,
    localizeDate,
    localizeTime,
    localizeChatChannelDate,
    todayOrYesterdayDate,
    localizeChatTimestamp,
  };
};

export default useTimeFormat;
