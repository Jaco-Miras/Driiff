import React, { useEffect, useRef, lazy, Suspense } from "react";
//import DatePicker from "react-date-picker";
const DatePicker = lazy(() => import("../lazy/ReactDatePicker"));

const DatePickerComponent = (props) => {
  const { className = "", calendarIcon = null, clearIcon = null, dayPlaceholder = "dd", monthPlaceholder = "mm", yearPlaceholder = "yy" } = props;

  const pickerRef = useRef(null);

  useEffect(() => {
    if (!pickerRef.current) {
      return;
    }
    const _this = pickerRef.current;

    _this.onOutsideAction = (event) => {
      if (_this.wrapper && !_this.wrapper.contains(event.target)) {
        _this.closeCalendar();
      }
    };
  });

  return (
    <Suspense fallback={<></>}>
      <DatePicker
        className={`react-datetime-picker ${className}`}
        ref={pickerRef}
        calendarIcon={calendarIcon}
        clearIcon={clearIcon}
        dayPlaceholder={dayPlaceholder}
        monthPlaceholder={monthPlaceholder}
        yearPlaceholder={yearPlaceholder}
        {...props}
      />
    </Suspense>
  );
};

export default DatePickerComponent;
