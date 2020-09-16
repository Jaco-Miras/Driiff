import React, {useEffect,useRef} from "react";
import DatePicker from "react-date-picker";

const DatePickerComponent = (props) => {
  const pickerRef = useRef();
  useEffect(() => {
    if (!pickerRef.current) {
      return;
    }
    const _this = pickerRef.current;

    _this.onOutsideAction = (event) => {
      if (
        _this.wrapper
        && !_this.wrapper.contains(event.target)
        // This is the line that fixes it
        && !event.target.className.indexOf("modal-content")
      ) {
        _this.closeCalendar();
      }
    }
  })
  const { calendarIcon = null, clearIcon = null, dayPlaceholder = "dd", monthPlaceholder = "mm", yearPlaceholder = "yy" } = props;
  return <DatePicker ref={pickerRef} calendarIcon={calendarIcon} clearIcon={clearIcon} dayPlaceholder={dayPlaceholder} monthPlaceholder={monthPlaceholder} yearPlaceholder={yearPlaceholder} {...props} />;
};

export default DatePickerComponent;
