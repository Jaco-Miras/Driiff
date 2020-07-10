import {useEffect, useRef} from "react";

const useOutsideClick = (ref, callback, when) => {

    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    });

    const clickHandler = e => {
        //console.log('click')
        if (ref.current && !ref.current.contains(e.target)) {
            savedCallback.current();
        }
    };

    const escapeHandler = e => {
        if (e.keyCode === 27) {
            savedCallback.current();
        }
    };

    useEffect(() => {
        if (when) {
            document.addEventListener("click", clickHandler);
            document.addEventListener("keydown", escapeHandler);
            return () => {
                document.removeEventListener("click", clickHandler);
                document.removeEventListener("keydown", escapeHandler);
            };
        }
    }, [when]);
};

export default useOutsideClick;