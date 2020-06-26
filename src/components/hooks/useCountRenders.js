import {useRef} from "react";

const useCountRenders = (componentName = "") => {

    const renders = useRef(0);
    console.log(`${componentName} render count:`, renders.current++);
};

export default useCountRenders;