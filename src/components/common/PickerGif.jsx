import React, {useEffect} from "react";
import GiphySelect from "react-giphy-select";
import "react-giphy-select/lib/styles.css";
import styled from "styled-components";

const PickerContainer = styled.div`
    position: relative;
    background-color: #fff;

    .selectDiv {
        border: 1px solid #cacaca;
        border-radius: 10px;
        padding: 10px;
    }

    .selectInputDiv {
        margin: 15px 15px 20px;
        padding: .5em 1em;
        width: calc(100% - 30px);
        box-sizing: border-box;
        font-family: inherit;
        font-size: 15px;
        font-weight: 300;
        border: 1px solid #cacaca;
        border-radius: 10px;
    }

    .attributionDiv {
        text-align: right;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: bold;
        padding: 5px 16px;
        letter-spacing: 0.25px;
    }
`;

const PickerGif = React.forwardRef((props, ref) => {

    const {className = ""} = props;

    useEffect(() => {
        const handleEscapeKey = e => {
            if (e.keyCode === 27) {
                props.handleShowGifPicker();
                document.removeEventListener("keydown", handleEscapeKey, false);
            }
        };
        const handleOutsideClick = e => {
            if (ref) {
                let pickerBtn = document.querySelector(".picker-btn");
                if (ref.current.contains(e.target) || e.target.contains(pickerBtn)) {

                } else {
                    props.handleShowGifPicker();
                    document.removeEventListener("mousedown", handleOutsideClick, false);
                }
            }
        };

        document.querySelector(".selectInputDiv").focus();

        document.addEventListener("mousedown", handleOutsideClick, false);
        document.addEventListener("keydown", handleEscapeKey, false);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick, false);
            document.removeEventListener("keydown", handleEscapeKey, false);
        };
    }, []);

    const onEntrySelect = (entry) => {
        // console.log(entry);
        props.onSelectGif(entry);
    };

    return (
        <PickerContainer
            className={`picker-gif ${className}`}
            ref={ref}
            orientation={props.orientation}>
            <GiphySelect
                theme={{
                    select: "selectDiv",
                    selectInput: "selectInputDiv",
                    attribution: "attributionDiv",
                }}
                onEntrySelect={onEntrySelect}
                requestKey={"na6sHnThmVFEFGTlKXlEkM5qtpx8kYUu"}
                placeholder={"Search GIFs Here.."}
            />
        </PickerContainer>
    );
});

export default PickerGif;