/* eslint-disable no-unused-vars */
import "moment/locale/nl";
import "moment/locale/de";
import moment from "moment-timezone";
import { useSelector } from "react-redux";

const useTimeFormat = () => {
  const { timezone, date_format, time_format, language } = useSelector((state) => state.settings.user.GENERAL_SETTINGS);

  moment.locale(language);
  moment.tz.setDefault(timezone);

  const todoFormat = (timestamp, dateFormat = `LL ${time_format}`) => {
    moment.updateLocale("en", {
      calendar: {
        lastDay: `[Yesterday at] ${time_format}`,
        nextDay: `[Tomorrow at] ${time_format}`,
        sameDay: `[Today at] ${time_format}`,
        nextWeek: `dddd [at] ${time_format}`,
        lastWeek: `[Last] dddd [at] ${time_format}`,
        sameElse: dateFormat,
      },
    });
    moment.updateLocale("nl", {
      calendar: {
        lastDay: `[gisteren om] ${time_format}`,
        nextDay: `[morgen om] ${time_format}`,
        sameDay: `[vandaag om] ${time_format}`,
        nextWeek: `dddd [om] ${time_format}`,
        lastWeek: `[afgelopen] dddd [om] ${time_format}`,
        sameElse: dateFormat,
      },
    });

    const utc = moment(moment(timestamp, "X").toDate());
    return utc.locale(language).calendar();
  };

  const todoFormatShortCode = (timestamp, dateFormat = `${date_format} ${time_format}`) => {
    moment.updateLocale("en", {
      calendar: {
        lastDay: "[Yesterday]",
        nextDay: "[Tomorrow]",
        sameDay: "[Today]",
        nextWeek: "[Next] dddd",
        lastWeek: "[Last] dddd",
        sameElse: dateFormat,
      },
    });
    moment.updateLocale("nl", {
      calendar: {
        lastDay: "[gisteren]",
        nextDay: "[morgen]",
        sameDay: "[vandaag]",
        nextWeek: "[deze] dddd",
        lastWeek: "[afgelopen] dddd",
        sameElse: dateFormat,
      },
    });
    const utc = moment(moment(timestamp, "X").toDate());
    return utc.locale(language).calendar();
  };

  const channelPreviewDate = (timestamp, dateFormat = `${date_format}`) => {
    moment.updateLocale("en", {
      calendar: {
        lastDay: "[Yesterday]",
        sameDay: `${time_format}`,
        lastWeek: "dddd",
        sameElse: dateFormat,
      },
    });
    moment.updateLocale("nl", {
      calendar: {
        lastDay: "[gisteren]",
        sameDay: `${time_format}`,
        nextWeek: "[deze] dddd",
        lastWeek: "[afgelopen] dddd",
        sameElse: dateFormat,
      },
    });

    const utc = moment(moment(timestamp, "X").toDate());
    return utc.locale(language).calendar();
  };

  const localizeDate = (timestamp, dateFormat = `${date_format} ${time_format}`) => {
    const utc = moment(moment(timestamp, "X").toDate());
    return utc.locale(language).format(dateFormat);
  };

  const localizeTime = (timestamp, timeFormat = `${time_format}`) => {
    const utc = moment(moment(timestamp, "X").toDate());
    return utc.locale(language).format(timeFormat);
  };

  const localizeChatDate = (timestamp, dateFormat = "LL") => {
    moment.updateLocale("en", {
      calendar: {
        lastDay: "[Yesterday]",
        sameDay: "[Today]",
        lastWeek: "dddd",
        sameElse: dateFormat,
      },
    });
    moment.updateLocale("nl", {
      calendar: {
        lastDay: "[gisteren]",
        sameDay: "[vandaag]",
        lastWeek: "dddd",
        sameElse: dateFormat,
      },
    });
    const utc = moment(moment(timestamp, "X").toDate());
    return utc.locale(language).calendar();
  };

  const todayOrYesterdayDate = (timestamp) => {
    moment.updateLocale("en", {
      calendar: {
        lastDay: `[Yesterday] ${time_format}`,
        sameDay: `[Today] ${time_format}`,
        sameElse: `MMM DD, YYYY[,] ${time_format}`,
        lastWeek: `dddd[,] ${time_format}`,
      },
    });
    moment.updateLocale("nl", {
      calendar: {
        lastDay: `[gisteren] ${time_format}`,
        sameDay: `[vandaag] ${time_format}`,
        sameElse: `MMM DD, YYYY[,] ${time_format}`,
        lastWeek: `dddd[,] ${time_format}`,
      },
    });
    const utc = moment(moment(timestamp, "X").toDate());
    return utc.locale(language).calendar();
  };

  const fromNow = (timestamp) => {
    const utc = moment(moment(timestamp, "X").toDate());
    return utc.locale(language).fromNow();
  };

  return {
    fromNow,
    localizeDate,
    localizeTime,
    localizeChatDate,
    todayOrYesterdayDate,
    todoFormat,
    todoFormatShortCode,
    channelPreviewDate,
  };
};

export default useTimeFormat;
