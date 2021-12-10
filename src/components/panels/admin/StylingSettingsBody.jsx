import React from 'react'
import styled from "styled-components";
import { useTheme } from 'styled-components';

const Wrapper = styled.div`
display: flex;
flex-direction: column;
`;
const Inputfields = styled.input`
margin-bottom: 16px;
width: 200px;`
const SubmitButton = styled.button`
width: 150px;
text-align: center; 
`
const CurrentPrimSpan = styled.span`
background-color: ${(props) => props.theme.colors.primary};
color: white;
`
const CurrentSecSpan = styled.span`
background-color: ${(props) => props.theme.colors.secondary};
color: white;
`
const CurrentThirdSpan = styled.span`
background-color: ${(props) => props.theme.colors.third};
color: white;
`

function StylingSettingsBody() {
    const theme = useTheme();
    console.log(theme)
    return (
        <div>
            <Wrapper theme={theme}>
           <h4>Styling</h4>
           <p>Add your primary color (current: <CurrentPrimSpan>{theme.colors.primary} </CurrentPrimSpan>)</p>
           <Inputfields className="w-100 form-control" id="primarycolor"></Inputfields>
           <p>Add your Secondary color (current: <CurrentSecSpan>{theme.colors.primary} </CurrentSecSpan>)</p>
           <Inputfields className="w-100 form-control" id="secondarycolor"></Inputfields>
           <p>Add your Third color (current: <CurrentThirdSpan>{theme.colors.primary} </CurrentThirdSpan>)</p>
           <Inputfields className="w-100 form-control" id="thirdcolor"></Inputfields>
           <SubmitButton className="btn btn-primary" id="SubmitColors">Submit</SubmitButton>
         
           </Wrapper>
        </div>
    )
}

export default StylingSettingsBody
