import { useCallback, useEffect } from "react";

const useFocusInput = (e) => {
  const handleOnKeyDown = useCallback((target) => {
    if (target.metaKey || target.ctrlKey) {
      if (target.key === "c") {
        //do not focus
      } else {
        if (
          !(document.activeElement.tagName.toLowerCase() === "input" || (document.activeElement.classList.contains("ql-editor") && !document.activeElement.classList.contains("chat-bubble"))) &&
          !document.getElementsByClassName("modal-open").length
        ) {
          if (e) {
            e.focus();
          }
        }
      }
    } else {
      if (
        !(document.activeElement.tagName.toLowerCase() === "input" || (document.activeElement.classList.contains("ql-editor") && !document.activeElement.classList.contains("chat-bubble"))) &&
        !document.getElementsByClassName("modal-open").length
      ) {
        if (e) {
          e.focus();
        }
      }
    }
    
  }, [e]);

  useEffect(() => {
    document.addEventListener("keydown", handleOnKeyDown, false);

    return () => {
      document.removeEventListener("keydown", handleOnKeyDown, false);
    };
  }, [handleOnKeyDown]);
};

export default useFocusInput;
