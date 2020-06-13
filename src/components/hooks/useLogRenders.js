import {useRef} from "react";

const useLogRenders = (componentName = "") => {

    const renders = useRef(0);

    if (componentName === "") {
        console.log(`renders`, renders.current += 1);
    } else {
        console.log(`renders[${componentName}]`, renders.current += 1);
    }
};

export default useLogRenders;