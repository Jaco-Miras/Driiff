import moment from "moment";

export const timelineFormat = (date) => {
    return moment(date).calendar(null, {
        nextDay: "[Tomorrow] - MMMM DD, YYYY",
        sameDay: "[Today] - dddd MMMM DD, YYYY",
        lastDay: "[Yesterday] - dddd MMMM DD, YYYY",
        lastWeek: "dddd MMMM DD, YYYY",
    });
};

export const startOfByDayFormat = (date) => {
    return moment(date).startOf("day").format();
};

export const timeByHalfFormat = (date) => {
    return moment(date).format("LT");
};

export const timeDateStringFormat = (date) => {
    return moment(date).format("MMMM DD, YYYY LT");
};

export const dateStringFormat = (date) => {
    return moment(date).format("MMMM DD, YYYY");
};

export const dateMonthDayFormat = date => {
    return moment(date).format("MMM DD");
};

export const dateMonthDayYearFormat = date => {
    return moment(date).format("MMM DD, YYYY");
};

export const diffInDays = (date) => {
    return moment().diff(date, "days");
};

export const diffInTime = (date) => {
    return moment().diff(date, "minutes");
};

export const diffInMinutes = (date) => {
    return moment().diff(date, "minutes");
};

export const diffInMinutesLocal = (date) => {
    var utc = moment.utc(date).toDate();
    var local = moment(utc).local();
    return diffInMinutes(local);
};

export const diffInHoursLocal = (timestamp) => {
    var utc = moment(timestamp, "X").toDate();
    var local = moment(utc).local();
    return moment().diff(local, "hours");
};

export const currentDate = (date) => {
    return moment(date);
};

export const localizeDateDiffLocal = (date) => {
    return moment(date).calendar(null, {
        sameDay: "[Today], MMM DD[,] YYYY hh:mm A",
        lastDay: "[Yesterday], MMM DD[,] YYYY hh:mm A",
        lastWeek: "dddd, MMM DD[,] YYYY hh:mm A",
        sameElse: "MMM DD[,] YYYY hh:mm A",
    });
};

export const localizeDate = (timestamp, dateFormat = "MMM DD[,] YYYY hh:mm A") => {
    var utc = moment(timestamp, "X").toDate();
    var local = moment(utc).local();
    return local.format(dateFormat);
};
export const localizeChatTimestamp = (timestamp, dateFormat = "MMM DD[,] YYYY hh:mm A") => {
    var utc = moment(timestamp, "X").toDate();
    var local = moment(utc).local();
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
export const localizeChatChannelDate = timestamp => {
    let dateString = moment.unix(timestamp).format("l");
    let currentDate = moment().format("l");
    let rd = new Date(dateString);
    let replyRD = rd.getDate();
    //let replyWeekRD = moment(rd).week()
    let yesterday = yesterdayDate();
    //let weekDate = new Date();
    //let thisWeek = moment(weekDate).week()

    if (dateString === currentDate) {
        return localizeDate(timestamp, "HH:mm");
    } else if (replyRD === yesterday) {
        return "Yesterday";
    } else if (diffInDays(rd) <= 6) {
        return localizeDate(timestamp, "dddd");
    }
        // else if (replyWeekRD === thisWeek){
        //     return localizeDate(timestamp, 'dddd')
    // }
    else {
        return localizeDate(timestamp, "DD-MM-YYYY");
    }
};

const yesterdayDate = () => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getDate();
};

export const todayOrYesterdayDate = (timestamp) => {
    var utc = moment(timestamp, "X").toDate();
    var local = moment(utc).local();
    var hours = moment().diff(moment(utc), 'hours');

    if(hours < 24) {
        return moment().calendar().substring(0, moment().calendar().indexOf(' ')) + ', ' + local.format("HH:mm");
    } else if (hours < 48) {
        return moment().subtract(1, 'days').calendar().substring(0, moment().subtract(1, 'days').calendar().indexOf(' '))  + ', ' + local.format("HH:mm");
    } else {
        return local.format("dddd[,] HH:mm");
    }
};