import { useEffect } from "react";

const useFocusInput = (e) => {
  const handleOnKeyDown = (target) => {
    if (target.metaKey || target.ctrlKey || target.keyCode === 17 || target.which === 17) return;

    if (
      !(document.activeElement.tagName.toLowerCase() === "input" || (document.activeElement.classList.contains("ql-editor") && !document.activeElement.classList.contains("chat-bubble"))) &&
      !document.getElementsByClassName("modal-open").length
    ) {
      if (e) {
        e.focus();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleOnKeyDown, false);

    return () => {
      document.removeEventListener("keydown", handleOnKeyDown, false);
    };
  }, [handleOnKeyDown]);
};

export default useFocusInput;
