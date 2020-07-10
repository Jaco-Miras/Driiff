
import React from "react";
import DatePicker from "react-date-picker";

const DatePickerComponent = props => {
    const {
        calendarIcon = null,
        clearIcon = null,
        dayPlaceholder = "dd",
        monthPlaceholder = "mm",
        yearPlaceholder = "yy",
    } = props;
    return (
        <DatePicker
            calendarIcon={calendarIcon}
            clearIcon={clearIcon}
            dayPlaceholder={dayPlaceholder}
            monthPlaceholder={monthPlaceholder}
            yearPlaceholder={yearPlaceholder}
            {...props}
        />
    );
};

export default DatePickerComponent;
