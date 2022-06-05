import React from "react";
import styled from "styled-components";

const Svg = styled.svg`
  ${(props) => typeof props.rotate !== "undefined" && `transform: rotate(${props.rotate}deg);`};
`;

export const SvgIconFeather = React.memo(
  React.forwardRef((props, ref) => {
    let { className = "", width = 24, height = 24, viewBox = "0 0 24 24", fill = "none", stroke = "currentColor", strokeWidth = "2", strokeLinecap = "round", strokeLinejoin = "round", icon, ...rest } = props;

    let content = "";

    switch (icon) {
      case "copy":
        content = (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </>
        );
        break;
      case "gdoc":
        viewBox = "0 0 48 48";
        stroke = "none";
        content = (
          <>
            <path fill="#2196f3" d="M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l10,10v29C40,43.657,38.657,45,37,45z" />
            <path fill="#bbdefb" d="M40 13L30 13 30 3z" />
            <path fill="#1565c0" d="M30 13L40 23 40 13z" />
            <path fill="#e3f2fd" d="M15 23H33V25H15zM15 27H33V29H15zM15 31H33V33H15zM15 35H25V37H15z" />
          </>
        );
        break;
      case "gsheet":
        viewBox = "0 0 48 48";
        stroke = "none";
        content = (
          <>
            <linearGradient id="PTsiEfj2THKtO9xz06mlla" x1="24" x2="24" y1="5" y2="43" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#21ad64" />
              <stop offset="1" stop-color="#088242" />
            </linearGradient>
            <path fill="url(#PTsiEfj2THKtO9xz06mlla)" d="M39,16v25c0,1.105-0.895,2-2,2H11c-1.105,0-2-0.895-2-2V7c0-1.105,0.895-2,2-2h17L39,16z" />
            <path fill="#61e3a7" d="M28,5v9c0,1.105,0.895,2,2,2h9L28,5z" />
            <path fill="#107c42" d="M39,16h-9c-0.473,0-0.917-0.168-1.257-0.444L39,27V16z" />
            <path
              fill="#fff"
              d="M32,23H16c-0.553,0-1,0.448-1,1v12c0,0.552,0.447,1,1,1h16c0.553,0,1-0.448,1-1V24	C33,23.448,32.553,23,32,23z M17,29h4v2h-4V29z M23,29h8v2h-8V29z M31,27h-8v-2h8V27z M21,25v2h-4v-2H21z M17,33h4v2h-4V33z M23,35	v-2h8v2H23z"
            />
            <path
              d="M32,22.5c0.827,0,1.5,0.673,1.5,1.5v12c0,0.827-0.673,1.5-1.5,1.5H16c-0.827,0-1.5-0.673-1.5-1.5V24 c0-0.827,0.673-1.5,1.5-1.5H32 M32,22H16c-1.103,0-2,0.897-2,2v12c0,1.103,0.897,2,2,2h16c1.103,0,2-0.897,2-2V24 C34,22.897,33.103,22,32,22L32,22z"
              opacity=".05"
            />
            <path
              d="M32,23c0.553,0,1,0.448,1,1v12c0,0.552-0.447,1-1,1H16c-0.553,0-1-0.448-1-1V24c0-0.552,0.447-1,1-1	H32 M32,22.5H16c-0.827,0-1.5,0.673-1.5,1.5v12c0,0.827,0.673,1.5,1.5,1.5h16c0.827,0,1.5-0.673,1.5-1.5V24	C33.5,23.173,32.827,22.5,32,22.5L32,22.5z"
              opacity=".07"
            />
          </>
        );
        break;

      case "gforms":
        viewBox = "0 0 48 48";
        stroke = "none";
        content = (
          <>
            <path fill="#43a047" d="M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l10,10v29C40,43.657,38.657,45,37,45z" />
            <path fill="#c8e6c9" d="M40 13L30 13 30 3z" />
            <path fill="#2e7d32" d="M30 13L40 23 40 13z" />
            <path fill="#e8f5e9" d="M19 23H33V25H19zM19 28H33V30H19zM19 33H33V35H19zM15 23H17V25H15zM15 28H17V30H15zM15 33H17V35H15z" />
          </>
        );
        break;
      case "office-word":
        viewBox = "0 0 48 48";
        stroke = "none";
        content = (
          <>
            <linearGradient id="Q7XamDf1hnh~bz~vAO7C6a" x1="28" x2="28" y1="14.966" y2="6.45" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#42a3f2" />
              <stop offset="1" stop-color="#42a4eb" />
            </linearGradient>
            <path fill="url(#Q7XamDf1hnh~bz~vAO7C6a)" d="M42,6H14c-1.105,0-2,0.895-2,2v7.003h32V8C44,6.895,43.105,6,42,6z" />
            <linearGradient id="Q7XamDf1hnh~bz~vAO7C6b" x1="28" x2="28" y1="42" y2="33.054" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#11408a" />
              <stop offset="1" stop-color="#103f8f" />
            </linearGradient>
            <path fill="url(#Q7XamDf1hnh~bz~vAO7C6b)" d="M12,33.054V40c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2v-6.946H12z" />
            <linearGradient id="Q7XamDf1hnh~bz~vAO7C6c" x1="28" x2="28" y1="-15.46" y2="-15.521" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#3079d6" />
              <stop offset="1" stop-color="#297cd2" />
            </linearGradient>
            <path fill="url(#Q7XamDf1hnh~bz~vAO7C6c)" d="M12,15.003h32v9.002H12V15.003z" />
            <linearGradient id="Q7XamDf1hnh~bz~vAO7C6d" x1="12" x2="44" y1="28.53" y2="28.53" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#1d59b3" />
              <stop offset="1" stop-color="#195bbc" />
            </linearGradient>
            <path fill="url(#Q7XamDf1hnh~bz~vAO7C6d)" d="M12,24.005h32v9.05H12V24.005z" />
            <path d="M22.319,13H12v24h10.319C24.352,37,26,35.352,26,33.319V16.681C26,14.648,24.352,13,22.319,13z" opacity=".05" />
            <path d="M22.213,36H12V13.333h10.213c1.724,0,3.121,1.397,3.121,3.121v16.425	C25.333,34.603,23.936,36,22.213,36z" opacity=".07" />
            <path d="M22.106,35H12V13.667h10.106c1.414,0,2.56,1.146,2.56,2.56V32.44C24.667,33.854,23.52,35,22.106,35z" opacity=".09" />
            <linearGradient id="Q7XamDf1hnh~bz~vAO7C6e" x1="4.744" x2="23.494" y1="14.744" y2="33.493" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#256ac2" />
              <stop offset="1" stop-color="#1247ad" />
            </linearGradient>
            <path fill="url(#Q7XamDf1hnh~bz~vAO7C6e)" d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z" />
            <path fill="#fff" d="M18.403,19l-1.546,7.264L15.144,19h-2.187l-1.767,7.489L9.597,19H7.641l2.344,10h2.352l1.713-7.689	L15.764,29h2.251l2.344-10H18.403z" />
          </>
        );
        break;
      case "office-excel":
        viewBox = "0 0 48 48";
        stroke = "none";
        content = (
          <>
            <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z" />
            <path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z" />
            <path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z" />
            <path fill="#17472a" d="M14 24.005H29V33.055H14z" />
            <g>
              <path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z" />
              <path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z" />
              <path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z" />
              <path fill="#129652" d="M29 24.005H44V33.055H29z" />
            </g>
            <path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z" />
            <path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z" />
          </>
        );
        break;
      case "office-ppt":
        viewBox = "0 0 48 48";
        stroke = "none";
        content = (
          <>
            <path fill="#dc4c2c" d="M8,24c0,9.941,8.059,18,18,18s18-8.059,18-18H26H8z" />
            <path fill="#f7a278" d="M26,6v18h18C44,14.059,35.941,6,26,6z" />
            <path fill="#c06346" d="M26,6C16.059,6,8,14.059,8,24h18V6z" />
            <path fill="#9b341f" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z" />
            <path
              fill="#fff"
              d="M14.673,19.012H10v10h2.024v-3.521H14.3c1.876,0,3.397-1.521,3.397-3.397v-0.058 C17.697,20.366,16.343,19.012,14.673,19.012z M15.57,22.358c0,0.859-0.697,1.556-1.556,1.556h-1.99v-3.325h1.99 c0.859,0,1.556,0.697,1.556,1.556V22.358z"
            />
          </>
        );
        break;
      case "dropbox":
        viewBox = "0 0 48 48";
        stroke = "none";
        content = (
          <>
            <path fill="#1E88E5" d="M42 13.976L31.377 7.255 24 13.314 35.026 19.732zM6 25.647L16.933 32.055 24 26.633 13.528 19.969zM16.933 7.255L6 14.301 13.528 19.969 24 13.314zM24 26.633L31.209 32.055 42 25.647 35.026 19.732z" />
            <path fill="#1E88E5" d="M32.195 33.779L31.047 34.462 29.979 33.658 24 29.162 18.155 33.646 17.091 34.464 15.933 33.785 13 32.066 13 34.738 23.988 42 35 34.794 35 32.114z" />
          </>
        );
        break;
      case "google-drive":
        viewBox = "0 0 48 48";
        stroke = "none";
        content = (
          <>
            <path fill="#1e88e5" d="M38.59,39c-0.535,0.93-0.298,1.68-1.195,2.197C36.498,41.715,35.465,42,34.39,42H13.61 c-1.074,0-2.106-0.285-3.004-0.802C9.708,40.681,9.945,39.93,9.41,39l7.67-9h13.84L38.59,39z" />
            <path
              fill="#fbc02d"
              d="M27.463,6.999c1.073-0.002,2.104-0.716,3.001-0.198c0.897,0.519,1.66,1.27,2.197,2.201l10.39,17.996 c0.537,0.93,0.807,1.967,0.808,3.002c0.001,1.037-1.267,2.073-1.806,3.001l-11.127-3.005l-6.924-11.993L27.463,6.999z"
            />
            <path fill="#e53935" d="M43.86,30c0,1.04-0.27,2.07-0.81,3l-3.67,6.35c-0.53,0.78-1.21,1.4-1.99,1.85L30.92,30H43.86z" />
            <path
              fill="#4caf50"
              d="M5.947,33.001c-0.538-0.928-1.806-1.964-1.806-3c0.001-1.036,0.27-2.073,0.808-3.004l10.39-17.996 c0.537-0.93,1.3-1.682,2.196-2.2c0.897-0.519,1.929,0.195,3.002,0.197l3.459,11.009l-6.922,11.989L5.947,33.001z"
            />
            <path fill="#1565c0" d="M17.08,30l-6.47,11.2c-0.78-0.45-1.46-1.07-1.99-1.85L4.95,33c-0.54-0.93-0.81-1.96-0.81-3H17.08z" />
            <path fill="#2e7d32" d="M30.46,6.8L24,18L17.53,6.8c0.78-0.45,1.66-0.73,2.6-0.79L27.46,6C28.54,6,29.57,6.28,30.46,6.8z" />
          </>
        );
        break;
      case "office-one-drive":
        viewBox = "0 0 48 48";
        stroke = "none";
        content = (
          <>
            <path fill="#084593" d="M24.5 8A14.5 14.5 0 1 0 24.5 37A14.5 14.5 0 1 0 24.5 8Z" />
            <path fill="#0556ab" d="M16.155,15.972c-1.32-0.505-2.753-0.781-4.25-0.781C5.33,15.191,0,20.521,0,27.096 c0,2.476,0.757,4.774,2.05,6.678c0.061-0.026,16.445-6.889,26.406-10.888C22.952,19.568,17.903,16.641,16.155,15.972z" />
            <path fill="#18b0ff" d="M48,29.373c0-5.317-4.31-9.627-9.627-9.627c-0.997,0-1.958,0.152-2.863,0.433 c-0.996,0.31-3.652,1.342-7.054,2.708c8.377,5.05,17.79,10.996,18.252,11.288C47.525,32.76,48,31.123,48,29.373z" />
            <path fill="#2cceff" d="M46.709,34.175c-0.463-0.292-9.875-6.238-18.252-11.288C18.495,26.885,2.111,33.748,2.05,33.774 C2.467,34.388,5.627,39,11.904,39c5.03,0,16.176,0,26.354,0C43.669,39,46.148,35.146,46.709,34.175z" />
          </>
        );
        break;
      case "filter":
        viewBox = "0 0 18 18";
        height = 18;
        width = 18;
        content = (
          <>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="menu" transform="translate(1.000000, 1.000000)" stroke="#E1E1E1">
                <path d="M5,8.5 L10.75,8.5" id="Path" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M4,5.5 L12,5.5" id="Path" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M7,11.5 L9.5,11.5" id="Path" stroke-linecap="round" stroke-linejoin="round"></path>
                <rect id="Rectangle" x="0" y="0" width="16" height="16" rx="8"></rect>
              </g>
            </g>
          </>
        );
        break;
      case "filter-active":
        viewBox = "0 0 18 18";
        height = 18;
        width = 18;
        content = (
          <>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="menu" transform="translate(1.000000, 1.000000)">
                <rect id="Rectangle" stroke="#505050" fill="#505050" x="0" y="0" width="16" height="16" rx="8"></rect>
                <path d="M5,8.5 L10.75,8.5" id="Path" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M4,5.5 L12,5.5" id="Path" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M7,11.5 L9.5,11.5" id="Path" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"></path>
              </g>
            </g>
          </>
        );
        break;
      case "admin-bot":
        content = (
          <>
            <path d="M 25 3 C 22.793 3 21 4.79297 21 7 C 21 8.85938 22.2813 10.4102 24 10.8594 L 24 14 L 15.0313 14 C 10.6016 14 7 17.6016 7 22.0313 L 7 26 L 2 26 L 2 38 L 7 38 L 7 47 L 43 47 L 43 38 L 48 38 L 48 26 L 43 26 L 43 22.0313 C 43 17.6016 39.3984 14 34.9688 14 L 26 14 L 26 10.8594 C 27.7227 10.4102 29 8.85938 29 7 C 29 4.79297 27.207 3 25 3 Z M 25 5 C 26.1016 5 27 5.89844 27 7 C 27 8.10156 26.1016 9 25 9 C 23.8984 9 23 8.10156 23 7 C 23 5.89844 23.8984 5 25 5 Z M 15.0313 16 L 34.9688 16 C 38.293 16 41 18.707 41 22.0313 L 41 45 L 35 45 L 35 37 L 15 37 L 15 45 L 9 45 L 9 22.0313 C 9 18.707 11.707 16 15.0313 16 Z M 18.5 22 C 16.0195 22 14 24.0195 14 26.5 C 14 28.9805 16.0195 31 18.5 31 C 20.9805 31 23 28.9805 23 26.5 C 23 24.0195 20.9805 22 18.5 22 Z M 31.5 22 C 29.0195 22 27 24.0195 27 26.5 C 27 28.9805 29.0195 31 31.5 31 C 33.9805 31 36 28.9805 36 26.5 C 36 24.0195 33.9805 22 31.5 22 Z M 18.5 24 C 19.8789 24 21 25.1211 21 26.5 C 21 27.8789 19.8789 29 18.5 29 C 17.1211 29 16 27.8789 16 26.5 C 16 25.1211 17.1211 24 18.5 24 Z M 31.5 24 C 32.8789 24 34 25.1211 34 26.5 C 34 27.8789 32.8789 29 31.5 29 C 30.1211 29 29 27.8789 29 26.5 C 29 25.1211 30.1211 24 31.5 24 Z M 4 28 L 7 28 L 7 36 L 4 36 Z M 43 28 L 46 28 L 46 36 L 43 36 Z M 17 39 L 21 39 L 21 45 L 17 45 Z M 23 39 L 27 39 L 27 45 L 23 45 Z M 29 39 L 33 39 L 33 45 L 29 45 Z" />
          </>
        );
        break;
      case "external-link":
        content = (
          <>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </>
        );
        break;
      case "help-circle":
        content = (
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </>
        );
        break;
      case "cpu": {
        content = (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="14" x2="23" y2="14"></line>
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="14" x2="4" y2="14"></line>
          </>
        );
        break;
      }
      case "clock": {
        content = (
          <>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </>
        );
        break;
      }
      case "phone":
        content = (
          <>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </>
        );
        break;
      case "sun":
        strokeWidth = "2";
        content = (
          <>
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </>
        );
        break;
      case "compass":
        content = (
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </>
        );
        break;
      case "home":
        content = (
          <>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </>
        );
        break;
      case "calendar":
        content = (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </>
        );
        break;
      case "book-open":
        content = (
          <>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </>
        );
        break;
      case "check":
        content = (
          <>
            <polyline points="20 6 9 17 4 12" />
          </>
        );
        break;
      case "check-circle":
        content = (
          <>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </>
        );
        break;
      case "chevron-down":
        content = (
          <>
            <polyline points="6 9 12 15 18 9" />
          </>
        );
        break;
      case "chevron-left":
        strokeWidth = "2";
        content = (
          <>
            <polyline points="15 18 9 12 15 6"></polyline>
          </>
        );
        break;
      case "chevron-right":
        strokeWidth = "2";
        content = (
          <>
            <polyline points="9 18 15 12 9 6" />
          </>
        );
        break;
      case "pencil":
        strokeWidth = "2";
        content = (
          <>
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </>
        );
        break;
      case "pencil-2":
        content = (
          <>
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </>
        );
        break;
      case "circle":
        content = (
          <>
            <circle cx="12" cy="12" r="10" />
          </>
        );
        break;
      case "x-circle":
        content = (
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </>
        );
        break;
      case "circle-plus":
        strokeWidth = "2";
        content = (
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </>
        );
        break;
      case "lock":
        // viewBox = "0 0 448 512";
        // content = (
        //   <>
        //     <path
        //       fill="currentColor"
        //       d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zM264 392c0 22.1-17.9 40-40 40s-40-17.9-40-40v-48c0-22.1 17.9-40 40-40s40 17.9 40 40v48zm32-168H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
        //     ></path>
        //   </>
        // );
        content = (
          <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </>
        );
        break;
      case "unlock":
        content = (
          <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </>
        );
        break;
      case "user-plus":
        strokeWidth = "2";
        content = (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </>
        );
        break;
      case "user":
        strokeWidth = "2";
        content = (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        );
        break;
      case "users":
        strokeWidth = "2";
        content = (
          <>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </>
        );
        break;
      case "inbox":
        content = (
          <>
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </>
        );
        break;
      case "eye":
        content = (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </>
        );
        break;
      case "eye-off":
        content = (
          <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </>
        );
        break;
      case "star":
        strokeWidth = "2";
        content = (
          <>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </>
        );
        break;
      case "volume-x":
        content = (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        );
        break;
      case "volume-2":
        content = (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        );
        break;
      case "volume":
        content = (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          </>
        );
        break;
      case "menu":
        strokeWidth = "2";
        content = (
          <>
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        );
        break;

      case "upload":
        content = (
          <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </>
        );
        break;
      case "upload-cloud":
        strokeWidth = "2";
        content = (
          <>
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            <polyline points="16 16 12 12 8 16" />
          </>
        );
        break;
      case "monitor":
        strokeWidth = "2";
        content = (
          <>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </>
        );
        break;
      case "corner-up-right":
        strokeWidth = "2";
        content = (
          <>
            <polyline points="15 14 20 9 15 4" />
            <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
          </>
        );
        break;
      case "corner-up-left":
        strokeWidth = "2";
        content = (
          <>
            <polyline points="9 14 4 9 9 4" />
            <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
          </>
        );
        break;
      case "arrow-left":
        strokeWidth = "2";
        content = (
          <>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </>
        );
        break;
      case "arrow-right":
        strokeWidth = "2";
        content = (
          <>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </>
        );
        break;
      case "arrow-right-circle":
        strokeWidth = "2";
        content = (
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 16 16 12 12 8"></polyline>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </>
        );
        break;

      case "arrow-down":
        strokeWidth = "2";
        content = (
          <>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </>
        );
        break;
      case "arrow-up":
        strokeWidth = "2";
        content = (
          <>
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </>
        );
        break;
      case "download":
        strokeWidth = "2";
        content = (
          <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </>
        );
        break;
      case "start":
        content = (
          <>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </>
        );
        break;
      case "mail":
        content = (
          <>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </>
        );
        break;
      case "database":
        strokeWidth = "1";
        content = (
          <>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </>
        );
        break;
      case "rotate-ccw":
        content = (
          <>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </>
        );
        break;
      case "refresh-ccw":
        content = (
          <>
            <polyline points="1 4 1 10 7 10" />
            <polyline points="23 20 23 14 17 14" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </>
        );
        break;
      case "refresh-cw":
        content = (
          <>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </>
        );
        break;
      case "share":
        strokeWidth = "2";
        content = (
          <>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </>
        );
        break;
      case "link":
        content = (
          <>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </>
        );
        break;
      case "play":
        content = (
          <>
            <polygon points="5 3 19 12 5 21 5 3" />
          </>
        );
        break;
      case "plus":
        content = (
          <>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </>
        );
        break;
      case "x":
        content = (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        );
        break;
      case "trash":
        strokeWidth = "2";
        content = (
          <>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </>
        );
        break;
      case "trash-2":
        content = (
          <>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </>
        );
        break;
      case "edit":
        strokeWidth = "2";
        content = (
          <>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </>
        );
        break;
      case "edit-2":
        content = (
          <>
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </>
        );
        break;
      case "edit-3":
        content = (
          <>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </>
        );
        break;
      case "search":
        strokeWidth = "2";
        content = (
          <>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </>
        );

        break;
      case "image":
        content = (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </>
        );
        break;
      case "heart":
        content = (
          <>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </>
        );
        break;
      case "video":
        content = (
          <>
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </>
        );
        break;
      case "video-off":
        content = (
          <>
            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </>
        );
        break;
      case "google-meet":
        viewBox = "-13.1265 -18 113.763 108";
        content = (
          <>
            <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z" />
            <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z" />
            <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
            <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
            <path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z" />
            <path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z" />
          </>
        );
        break;
      case "zoom":
        viewBox = "0 0 48 48";
        content = (
          <>
            <circle cx="24" cy="24" r="20" fill="#2196f3" />
            <path fill="#fff" d="M29,31H14c-1.657,0-3-1.343-3-3V17h15c1.657,0,3,1.343,3,3V31z" />
            <polygon fill="#fff" points="37,31 31,27 31,21 37,17" />
          </>
        );
        break;
      case "meet":
        content = (
          <>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="Group">
                <g>
                  <polygon id="Path" fill="#A7A7A7" fillRule="nonzero" points="12.9375 9.5 15.1669318 12.0729167 18.1647727 14.0072222 18.6875 9.51583333 18.1647727 5.12472222 15.1094318 6.82416667"></polygon>
                  <path
                    d="M0,13.5902778 L0,17.4166667 C0,18.2914583 0.701761364,19 1.56818182,19 L5.35795455,19 L6.14204545,16.1077778 L5.35795455,13.5902778 L2.75738636,12.7986111 L0,13.5902778 Z"
                    id="Path"
                    fill="#949494"
                    fillRule="nonzero"
                  ></path>
                  <polygon id="Path" fill="#9C9C9C" fillRule="nonzero" points="5.35795455 0 0 5.40972222 2.75738636 6.20138889 5.35795455 5.40972222 6.12897727 2.92652778"></polygon>
                  <polygon id="Path" fill="#DADADA" fillRule="nonzero" points="5.35795455 5.40972222 0 5.40972222 0 13.5902778 5.35795455 13.5902778"></polygon>
                  <path
                    d="M21.5886364,2.29055556 L18.1647727,5.12472222 L18.1647727,14.0072222 L21.6043182,16.8545833 C22.1192045,17.2609722 22.8719318,16.8902083 22.8719318,16.2291667 L22.8719318,2.90277778 C22.8719318,2.23381944 22.1022159,1.86701389 21.5886364,2.29055556 Z M12.9375,9.5 L12.9375,13.5902778 L5.35795455,13.5902778 L5.35795455,19 L16.5965909,19 C17.4630114,19 18.1647727,18.2914583 18.1647727,17.4166667 L18.1647727,14.0072222 L12.9375,9.5 Z"
                    id="Shape"
                    fill="#CACACA"
                    fillRule="nonzero"
                  ></path>
                  <path
                    d="M16.5965909,0 L5.35795455,0 L5.35795455,5.40972222 L12.9375,5.40972222 L12.9375,9.5 L18.1647727,5.12736111 L18.1647727,1.58333333 C18.1647727,0.708541667 17.4630114,0 16.5965909,0 Z"
                    id="Path"
                    fill="#E1E1E1"
                    fillRule="nonzero"
                  ></path>
                </g>
              </g>
            </g>
          </>
        );
        break;
      case "save":
        content = (
          <>
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </>
        );
        break;
      case "smile":
        // strokeWidth = "2";
        strokeWidth = "0";
        width = "16";
        height = "16";
        viewBox = "0 0 16 16";
        content = (
          <>
            <path
              d="M0,8a8,8,0,1,1,8,8A8.01,8.01,0,0,1,0,8ZM1.143,8A6.857,6.857,0,1,0,8,1.143,6.865,6.865,0,0,0,1.143,8Zm4.785,2.731L5.9,10.706a.572.572,0,0,1,.748-.865,2.3,2.3,0,0,0,2.713,0l.032-.025a.571.571,0,0,1,.683.915,3.411,3.411,0,0,1-4.144,0ZM9.715,6.857A1.143,1.143,0,1,1,10.858,8,1.143,1.143,0,0,1,9.715,6.857ZM4,6.857A1.143,1.143,0,1,1,5.143,8,1.143,1.143,0,0,1,4,6.857Z"
              fill="currentColor"
            />
          </>
        );
        break;
      case "paperclip":
        strokeWidth = "2";
        content = (
          <>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </>
        );
        break;
      case "send-post":
        strokeWidth = "0";
        width = "16.696";
        height = "16";

        viewBox = "0 0 16.696 16";
        content = (
          <>
            <path
              d="M6.446,15.974a.522.522,0,0,1-.359-.5V12.252l2.83.967L7.029,15.787a.52.52,0,0,1-.42.213A.514.514,0,0,1,6.446,15.974Zm7.646-2.089L6.8,11.393l7.17-8.64L4.7,10.677.353,9.19a.522.522,0,0,1-.072-.957L15.933.059a.523.523,0,0,1,.758.54L14.777,13.469a.521.521,0,0,1-.517.445A.541.541,0,0,1,14.092,13.885Z"
              transform="translate(0 0)"
              fill="currentColor"
            />
          </>
        );
        break;
      case "send":
        strokeWidth = "0";
        width = "16.696";
        height = "16";

        viewBox = "0 0 16.696 16";
        content = (
          <>
            <path
              d="M6.446,15.974a.522.522,0,0,1-.359-.5V12.252l2.83.967L7.029,15.787a.52.52,0,0,1-.42.213A.514.514,0,0,1,6.446,15.974Zm7.646-2.089L6.8,11.393l7.17-8.64L4.7,10.677.353,9.19a.522.522,0,0,1-.072-.957L15.933.059a.523.523,0,0,1,.758.54L14.777,13.469a.521.521,0,0,1-.517.445A.541.541,0,0,1,14.092,13.885Z"
              transform="translate(0 0)"
            />
          </>
        );
        break;
      case "folder":
        content = (
          <>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </>
        );
        break;
      case "folder-plus":
        strokeWidth = "2";
        content = (
          <>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <line x1="12" y1="11" x2="12" y2="17"></line>
            <line x1="9" y1="14" x2="15" y2="14"></line>
          </>
        );
        break;
      case "file":
        content = (
          <>
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </>
        );
        break;
      case "file-minus":
        content = (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </>
        );
        break;
      case "file-text":
        content = (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </>
        );
        break;
      case "moon":
        strokeWidth = "2";
        content = (
          <>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </>
        );
        break;
      case "bell":
        strokeWidth = "2";
        content = (
          <>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </>
        );
        break;
      case "bell-off":
        content = (
          <>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            <path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path>
            <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path>
            <path d="M18 8a6 6 0 0 0-9.33-5"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </>
        );
        break;
      case "bar-chart-2":
        content = (
          <>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </>
        );
        break;
      case "command":
        content = (
          <>
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </>
        );
        break;
      case "message-square":
        content = (
          <>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </>
        );
        break;
      case "message-circle":
        content = (
          <>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </>
        );
        break;
      case "settings":
        content = (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </>
        );
        break;
      case "log-out":
        content = (
          <>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </>
        );
        break;
      case "more-horizontal":
        content = (
          <>
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </>
        );
        break;
      case "more-vertical":
        content = (
          <>
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </>
        );
        break;
      case "archive":
        content = (
          <>
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </>
        );
        break;
      case "gdrive":
        content = (
          <>
            <path d="m323.303 31h-133.799c-5.361 0-10.313 2.856-12.993 7.5s-2.681 10.356 0 15l143.042 247.5h168.726l-151.998-262.515c-2.68-4.629-7.632-7.485-12.978-7.485z" />
            <path d="m154.034 75.947-152.011 262.538c-2.622 4.512-2.695 10.049-.22 14.648l64.805 120c2.578 4.775 7.544 7.793 12.979 7.866h.22c5.347 0 10.313-2.856 12.993-7.5l145.494-251.757z" />
            <path d="m509.88 338.31c-2.695-4.526-7.588-7.31-12.876-7.31h-286.41l-86.678 150h308.284c5.508 0 10.576-3.018 13.198-7.866l64.805-120c2.504-4.658 2.387-10.283-.323-14.824z" />
          </>
        );
        break;
      case "info":
        content = (
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </>
        );
        break;
      case "warning":
        content = (
          <>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </>
        );
        break;
      case "alert-x":
        content = (
          <>
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </>
        );
        break;
      case "list":
        content = (
          <>
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </>
        );
        break;
      case "alert-circle":
        content = (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        );
        break;
      case "thumbs-up":
        content = (
          <>
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </>
        );
        break;
      case "sliders":
        content = (
          <>
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </>
        );
        break;
      case "gift":
        content = (
          <>
            <polyline points="20 12 20 22 4 22 4 12"></polyline>
            <rect x="2" y="7" width="20" height="5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
          </>
        );
        break;
      case "megaphone":
        content = (
          <>
            <path d="M4.574 16.989c-1.768.647-3.719-.275-4.365-2.06-.647-1.785.262-3.757 2.027-4.404l3.242-1.187 2.338 6.464-3.242 1.187zm6.282 3.172c-.437-.151-.814-.43-1.089-.8l-1.635-2.202-3.301 1.209 2.602 3.353c.292.376.79.52 1.237.356l2.216-.81c.229-.084.382-.307.381-.553-.002-.246-.156-.464-.389-.545l-.022-.008zm-4.09-11.294l2.338 6.464c2.155-.417 5.077-.401 8.896.401l-4.675-12.927c-2.476 3.165-4.663 5.004-6.559 6.062zm10.795-3.102c.856.411 1.556 1.149 1.893 2.117.339.967.254 1.98-.157 2.836l1.407.678c.585-1.216.708-2.656.227-4.03-.481-1.375-1.474-2.424-2.689-3.009l-.681 1.408zm1.188-2.465c1.486.715 2.698 1.998 3.286 3.678s.438 3.441-.277 4.927l1.443.696c.893-1.857 1.079-4.055.346-6.153-.735-2.097-2.247-3.698-4.102-4.591l-.696 1.443z" />
          </>
        );
        break;
      default:
        console.log(`${icon} not found`);
    }

    return (
      <Svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        className={`feather feather-${icon} ${className}`}
        {...rest}
      >
        {content}
      </Svg>
    );
  })
);

export const SvgIcon = React.memo(
  React.forwardRef((props, ref) => {
    const { className = "", width = 24, height = 24, fill = "none", stroke = "currentColor", strokeWidth = "1", strokeLinecap = "round", strokeLinejoin = "round", icon, ...rest } = props;

    if (icon === "gripp-logo") return <img alt="gripp logo" className={`icon-${icon} ${className}`} width={width} height={height} src={require("../../assets/icon/gripp-logo.svg")} />;
    if (icon === "google-label") return <img alt="google label" className={`icon-${icon} ${className}`} width={width} height={height} src={require("../../assets/icon/google-label.svg")} />;
     
    let content = "";
    let viewBox = "";

    switch (icon) {
      case "archive":
        viewBox = "0 0 48 48";
        content = (
          <>
            <defs>
              <linearGradient x1="0%" y1="7.77940102%" x2="100%" y2="92.220599%" id="linearGradient-1">
                <stop stopColor="#972C86" offset="0%" />
                <stop stopColor="#794997" offset="40%" />
                <stop stopColor="#007180" offset="100%" />
              </linearGradient>
            </defs>
            <g id="_icon/archive/l/active" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path
                d="M39,20.5 C39.7796961,20.5 40.4204487,21.0948881 40.4931334,21.85554 L40.5,22 L40.5,37.4285714 C40.5,39.5999931 38.8250623,41.3885867 36.7004613,41.4949924 L36.5,41.5 L11.5,41.5 C9.3484916,41.5 7.6083567,39.777207 7.50486965,37.630981 L7.5,37.4285714 L7.5,22 C7.5,21.1715729 8.17157288,20.5 9,20.5 C9.77969612,20.5 10.4204487,21.0948881 10.4931334,21.85554 L10.5,22 L10.5,37.4285714 C10.5,37.9895449 10.8983759,38.4367012 11.3927122,38.4938289 L11.5,38.5 L36.5,38.5 C37.006502,38.5 37.4386447,38.0902419 37.4940126,37.5469373 L37.5,37.4285714 L37.5,22 C37.5,21.1715729 38.1715729,20.5 39,20.5 Z M29.5,22 C30.8807119,22 32,23.1192881 32,24.5 C32,25.8807119 30.8807119,27 29.5,27 L18.5,27 C17.1192881,27 16,25.8807119 16,24.5 C16,23.1192881 17.1192881,22 18.5,22 L29.5,22 Z M38.6,7.5 C40.7539105,7.5 42.5,9.24608948 42.5,11.4 L42.5,11.4 L42.5,14.6 C42.5,16.7539105 40.7539105,18.5 38.6,18.5 L38.6,18.5 L9.4,18.5 C7.24608948,18.5 5.5,16.7539105 5.5,14.6 L5.5,14.6 L5.5,11.4 C5.5,9.24608948 7.24608948,7.5 9.4,7.5 L9.4,7.5 Z M38.6,10.5 L9.4,10.5 C8.90294373,10.5 8.5,10.9029437 8.5,11.4 L8.5,11.4 L8.5,14.6 C8.5,15.0970563 8.90294373,15.5 9.4,15.5 L9.4,15.5 L38.6,15.5 C39.0970563,15.5 39.5,15.0970563 39.5,14.6 L39.5,14.6 L39.5,11.4 C39.5,10.9029437 39.0970563,10.5 38.6,10.5 L38.6,10.5 Z"
                id="Combined-Shape"
                fill="url(#linearGradient-1)"
                fillRule="nonzero"
              />
            </g>
          </>
        );
        break;
      case "reply":
        viewBox = "0 0 41 31";
        content = (
          <>
            <defs>
              <linearGradient x1="-1.11022302e-14%" y1="1.72254642e-14%" x2="100%" y2="100%" id="linearGradient-1">
                <stop stopColor="#972C86" offset="0%" />
                <stop stopColor="#794997" offset="40%" />
                <stop stopColor="#007180" offset="100%" />
              </linearGradient>
            </defs>
            <g id="E---Notifications" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="E1---01a-Notifications---Overview" transform="translate(-42.000000, -1381.000000)" fill="url(#linearGradient-1)" fillRule="nonzero">
                <g id="Group-13" transform="translate(20.000000, 1364.000000)">
                  <g id="Group-24-Copy-3" transform="translate(11.000000, 0.000000)">
                    <g id="_icon/reply/l/active" transform="translate(8.000000, 9.000000)">
                      <path
                        d="M20.5,37 C20.5,38.309747 18.9390974,38.990409 17.9793234,38.0991902 L3.97932335,25.0991902 C3.35630446,24.5206727 3.3381597,23.54052 3.93933983,22.9393398 L17.9393398,8.93933983 C18.8842871,7.99439254 20.5,8.66364272 20.5,10 L20.5,19.3691406 C20.5,20.1975677 19.8284271,20.8691406 19,20.8691406 C18.1715729,20.8691406 17.5,20.1975677 17.5,19.3691406 L17.5,13.6213203 L7.16133128,23.9599891 L17.5,33.5601814 L17.5,24.5 C17.5,23.6715729 18.1715729,23 19,23 L34.2221177,23 C39.3466003,23 43.5008143,27.154214 43.5008143,32.2786967 C43.5008143,32.6274968 43.4811465,32.9760194 43.4419044,33.322605 C43.3487014,34.1457725 42.6058364,34.7375257 41.7826689,34.6443227 C40.9595014,34.5511198 40.3677483,33.8082547 40.4609512,32.9850873 C40.4875055,32.7505601 40.5008143,32.5147223 40.5008143,32.2786967 C40.5008143,28.8110682 37.6897461,26 34.2221177,26 L20.5,26 L20.5,37 Z"
                        id="Path"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </>
        );
        break;
      case "document":
        viewBox = "0 0 1536 1792";
        content = (
          <>
            <path
              d="M1468 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28H96q-40 0-68-28t-28-68V96q0-40 28-68T96 0h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528V640H992q-40 0-68-28t-28-68V128H128v1536h1280zM384 800q0-14 9-23t23-9h704q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64zm736 224q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704zm0 256q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704z"
              fill="#626262"
            />
          </>
        );
        break;
      case "image-video":
        viewBox = "0 0 448 512";
        content = (
          <>
            <path
              fill="currentColor"
              d="M128 192a32 32 0 1 0-32-32 32 32 0 0 0 32 32zM416 32H32A32 32 0 0 0 0 64v384a32 32 0 0 0 32 32h384a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32zm-32 320H64V96h320zM268.8 209.07a16 16 0 0 0-25.6 0l-49.32 65.75L173.31 244a16 16 0 0 0-26.62 0L96 320h256z"
            />
          </>
        );
        break;
      case "pin":
        viewBox = "0 0 24 24";
        content = (
          <>
            <g id="_icon/pin/r/secundary" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M15.7692308,8.70635677 C18.2871227,9.7169252 20,11.7084386 20,14 L4,14 C4,11.7084386 5.71287732,9.7169252 8.23076923,8.70635677 L8.23076923,2 L15.7692308,2 L15.7692308,8.70635677 Z"
                id="Combined-Shape"
                stroke="#972C86"
                strokeWidth="2"
              />
              <path d="M10.5,17.4019238 L13.5,22.5980762" id="Line-2" stroke="#972C86" strokeWidth="2" transform="translate(12.000000, 20.000000) rotate(30.000000) translate(-12.000000, -20.000000)" />
            </g>
          </>
        );
        break;
      case "mute":
        viewBox = "0 0 24 24";
        content = (
          <>
            <path d="M6.092 15H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4l5.293-5.293A1 1 0 0 1 16 4.414V6.5m0 5.5v7.558a1 1 0 0 1-1.713.701l-4.04-4.104" />
            <path d="M6 19.818L21 7" />
          </>
        );
        break;
      case "driff-logo":
        viewBox = "0 0 465 355";
        content = (
          <>
            <defs>
              <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="linearGradient-1">
                <stop stopColor="#972C86" offset="0%" />
                <stop stopColor="#794997" offset="40%" />
                <stop stopColor="#007180" offset="100%" />
              </linearGradient>
            </defs>
            <g id="Symbols,-Styles-&amp;-Typography" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="logo/gradient" fill="url(#linearGradient-1)">
                <path
                  d="M444.876694,189.762858 C444.876694,184.355858 449.260694,179.972858 454.666694,179.972858 C460.073694,179.972858 464.456694,184.355858 464.456694,189.762858 C464.456694,195.169858 460.073694,199.552858 454.666694,199.552858 C449.260694,199.552858 444.876694,195.169858 444.876694,189.762858 Z M153.753094,95.3067584 C175.403094,118.181758 181.133094,149.458758 172.867094,179.417758 C162.355094,217.514758 130.210094,243.101758 94.2370945,256.022758 C81.8950945,260.454758 68.7470945,263.670758 55.6180945,264.438758 C51.9980945,264.651758 48.0080945,264.726758 44.5210945,263.619758 C38.5750945,261.731758 37.1550945,256.791758 37.3080945,251.188758 C38.6900945,200.786758 39.9310945,150.357758 39.2580945,99.9347584 C39.1110945,88.9087584 56.2120945,88.9397584 56.3580945,99.9347584 C56.4540945,107.041758 56.5080945,114.149758 56.5260945,121.256758 C56.5970945,149.275758 56.1930945,177.294758 55.5860945,205.306758 C55.3590945,215.758758 55.1000945,226.208758 54.8160945,236.659758 C54.7190945,240.186758 54.7800945,243.789758 54.6920945,247.366758 C55.0770945,247.351758 55.4610945,247.349758 55.8460945,247.325758 C56.9890945,247.254758 58.1310945,247.153758 59.2700945,247.033758 C59.8690945,246.970758 60.4650945,246.892758 61.0640945,246.826758 C61.0780945,246.824758 61.0870945,246.822758 61.1010945,246.820758 C67.0860945,245.854758 72.9920945,244.635758 78.8330945,242.998758 C82.2310945,242.046758 85.5960945,240.981758 88.9230945,239.806758 C92.5540945,238.524758 95.8140945,237.227758 98.1920945,236.172758 C129.822094,222.134758 155.397094,196.918758 159.092094,160.933758 C159.473094,157.220758 159.705094,153.475758 159.607094,149.741758 C159.573094,148.469758 159.502094,147.199758 159.396094,145.931758 C159.352094,145.409758 159.121094,143.665758 159.076094,143.216758 C158.206094,138.036758 156.832094,133.068758 155.028094,128.124758 C154.464094,126.577758 154.802094,127.518758 154.783094,127.474758 C154.475094,126.772758 154.162094,126.074758 153.836094,125.381758 C153.217094,124.070758 152.560094,122.778758 151.866094,121.506758 C150.370094,118.763758 148.702094,116.114758 146.875094,113.578758 C146.704094,113.341758 146.048094,112.473758 145.807094,112.148758 C145.547094,111.835758 144.858094,110.989758 144.647094,110.738758 C143.602094,109.499758 142.518094,108.294758 141.399094,107.123758 C138.961094,104.572758 136.350094,102.198758 133.608094,99.9767584 C132.620094,99.1757584 133.820094,100.088758 132.413094,99.0617584 C131.623094,98.4847584 130.829094,97.9137584 130.022094,97.3607584 C128.481094,96.3017584 126.905094,95.2937584 125.301094,94.3317584 C121.761094,92.2077584 118.082094,90.3107584 114.305094,88.6447584 C106.927094,85.3897584 96.8400945,82.5727584 88.0410945,80.9087584 C62.7140945,76.1177584 36.1160945,77.7367584 10.7810945,81.5557584 C6.19809447,82.2467584 1.60809447,80.4727584 0.26409447,75.5837584 C-0.85490553,71.5117584 1.66609447,65.7547584 6.23509447,65.0657584 C14.6450945,63.7987584 23.0840945,62.7127584 31.5590945,61.9977584 C73.4210945,58.4627584 123.117094,62.9357584 153.753094,95.3067584 Z M333.321994,31.2604584 C333.606994,31.4904584 334.527994,32.0314584 333.321994,31.2604584 Z M334.095994,27.7654584 C334.627994,27.2394584 334.361994,27.4264584 334.095994,27.7654584 Z M249.691994,203.864458 C249.443994,203.615458 249.509994,203.683458 249.691994,203.864458 Z M436.655994,129.367458 C437.285994,128.286458 437.764994,127.117458 438.367994,126.027458 C442.031994,115.884458 458.325994,120.367458 454.787994,130.746458 C452.063994,138.737458 446.559994,146.098458 440.028994,151.345458 C430.246994,159.202458 418.730994,162.384458 406.891994,162.450458 C424.394994,193.161458 428.839994,231.853458 425.059994,266.436458 C423.288994,282.647458 419.952994,298.578458 413.287994,313.520458 C409.426994,322.175458 403.979994,331.211458 395.923994,336.574458 C388.955994,341.213458 378.923994,341.649458 375.738994,332.433458 C373.563994,326.142458 373.676994,318.677458 373.412994,312.093458 C372.350994,285.709458 373.186994,259.211458 373.805994,232.826458 C374.225994,214.956458 374.736994,197.089458 375.218994,179.221458 C367.471994,181.876458 359.245994,182.902458 350.967994,182.712458 C357.273994,196.084458 359.724994,211.191458 361.287994,225.745458 C362.961994,241.332458 363.400994,257.319458 361.845994,272.935458 C359.969994,291.775458 355.275994,310.275458 346.877994,327.295458 C342.381994,336.404458 336.004994,347.965458 326.451994,352.659458 C303.822994,363.778458 308.115994,317.102458 308.192994,306.912458 C308.442994,274.095458 309.858994,241.293458 310.746994,208.489458 C308.053994,209.346458 305.195994,209.757458 302.165994,209.566458 C291.027994,208.866458 284.320994,199.906458 280.508994,190.346458 C278.996994,195.094458 277.265994,199.765458 275.230994,204.311458 C269.782994,216.478458 260.200994,226.809458 245.809994,221.313458 C228.482994,214.696458 230.620994,194.017458 233.734994,179.302458 C235.047994,173.095458 236.726994,166.977458 238.406994,160.861458 C234.410994,163.548458 230.113994,165.784458 225.586994,167.445458 C224.622994,167.798458 223.619994,168.134458 222.588994,168.450458 C220.597994,179.747458 216.214994,190.878458 210.729994,200.440458 C201.734994,216.124458 187.267994,230.038458 168.803994,232.928458 C164.223994,233.644458 159.624994,231.825458 158.285994,226.956458 C157.161994,222.866458 159.691994,217.153458 164.257994,216.439458 C179.022994,214.128458 189.164994,204.002458 196.441994,190.965458 C199.862994,184.837458 202.660994,177.722458 204.455994,170.708458 C198.452994,170.186458 192.829994,168.103458 188.802994,163.517458 C179.845994,153.314458 182.949994,136.882458 195.312994,131.090458 C202.736994,127.612458 211.388994,127.373458 217.316994,133.682458 C221.362994,137.989458 222.913994,144.000458 223.475994,149.798458 C225.670994,148.780458 227.801994,147.585458 229.843994,146.162458 C232.128994,144.571458 234.750994,142.140458 236.909994,139.799458 C237.804994,138.828458 238.668994,137.824458 239.490994,136.791458 C239.433994,136.826458 240.850994,134.900458 241.059994,134.591458 C242.228994,132.864458 243.316994,131.076458 244.570994,128.877458 C248.140994,120.314458 261.033994,120.908458 261.365994,131.149458 C261.924994,148.399458 254.269994,165.623458 250.577994,182.225458 C249.812994,185.666458 249.044994,189.649458 248.799994,192.360458 C248.646994,194.059458 248.544994,195.765458 248.567994,197.471458 C248.577994,198.124458 248.881994,200.836458 248.777994,200.553458 C248.953994,201.285458 249.328994,202.640458 249.489994,203.238458 C249.616994,203.531458 249.911994,204.058458 250.760994,204.834458 C250.958994,204.966458 251.487994,205.219458 251.672994,205.320458 C252.312994,205.528458 253.216994,205.794458 254.222994,205.741458 C254.807994,205.189458 255.364994,204.620458 255.915994,204.002458 C256.287994,203.450458 256.662994,202.904458 257.014994,202.339458 C260.348994,197.002458 261.339994,193.911458 263.308994,187.944458 C267.601994,174.939458 270.355994,161.411458 272.677994,147.932458 C273.440994,143.508458 274.131994,139.071458 274.768994,134.626458 C275.010994,131.769458 275.364994,128.932458 275.907994,126.148458 C277.745994,116.723458 293.812994,118.898458 292.702994,128.421458 C292.512994,130.043458 292.294994,131.661458 292.085994,133.281458 C291.971994,134.548458 291.860994,135.813458 291.783994,137.083458 C291.199994,146.751458 291.374994,156.527458 292.413994,166.157458 C292.841994,170.123458 293.661994,175.049458 295.002994,179.862458 C296.324994,184.603458 296.767994,186.311458 299.517994,190.154458 C298.822994,189.152458 300.582994,191.252458 301.108994,191.765458 C301.352994,191.929458 301.629994,192.093458 301.941994,192.344458 C302.087994,192.364458 302.293994,192.394458 303.467994,192.532458 C303.576994,192.531458 303.985994,192.498458 305.065994,192.323458 C305.536994,192.222458 305.991994,192.061458 306.504994,191.892458 C308.553994,190.898458 309.724994,189.982458 311.193994,188.624458 C311.863994,150.579458 311.556994,112.518458 312.813994,74.4844584 C313.316994,59.2584584 313.647994,43.7244584 316.314994,28.6854584 C317.046994,24.5594584 318.077994,19.9304584 321.057994,16.7904584 C324.931994,12.7104584 331.755994,12.4964584 336.827994,14.0924584 C349.853994,18.1894584 355.887994,33.4004584 358.826994,45.4454584 C363.165994,63.2274584 363.393994,82.2544584 361.170994,100.353458 C359.156994,116.744458 355.617994,132.948458 350.629994,148.691458 C348.874994,154.227458 346.964994,159.826458 344.789994,165.334458 C345.292994,165.384458 345.915994,165.437458 346.821994,165.512458 C356.378994,166.310458 362.627994,165.766458 371.248994,162.586458 C372.674994,162.060458 374.179994,161.334458 375.704994,160.468458 C375.835994,155.176458 375.968994,149.885458 376.084994,144.592458 C376.909994,106.512458 376.835994,68.1944584 379.932994,30.2094584 C380.568994,22.4124584 380.114994,9.87645843 386.019994,3.70245843 C392.629994,-3.20754157 403.239994,0.625458433 408.973994,6.47345843 C417.126994,14.7894584 421.047994,27.1224584 423.278994,38.2564584 C427.015994,56.9064584 426.812994,76.2114584 424.729994,95.0474584 C422.865994,111.895458 419.328994,129.871458 411.568994,145.336458 C412.771994,145.204458 413.964994,145.021458 415.140994,144.767458 C418.362994,144.072458 421.380994,143.057458 423.407994,141.954458 C425.981994,140.554458 428.009994,139.257458 429.128994,138.276458 C430.896994,136.723458 432.519994,135.064458 434.038994,133.272458 C434.136994,133.136458 434.777994,132.316458 435.272994,131.578458 C435.756994,130.856458 436.218994,130.118458 436.655994,129.367458 Z M286.000694,108.552958 C280.593694,108.552958 276.210694,104.169958 276.210694,98.7629584 C276.210694,93.3559584 280.593694,88.9729584 286.000694,88.9729584 C291.406694,88.9729584 295.790694,93.3559584 295.790694,98.7629584 C295.790694,104.169958 291.406694,108.552958 286.000694,108.552958 Z M403.610994,117.324458 C407.748994,101.065458 409.287994,84.0154584 409.082994,67.2664584 C408.922994,54.2534584 407.281994,39.0804584 402.513994,27.8884584 C401.619994,25.7874584 400.550994,23.7344584 399.342994,21.7974584 C398.951994,21.1684584 398.535994,20.5494584 398.102994,19.9444584 C398.082994,20.0814584 398.060994,20.2194584 398.040994,20.3564584 C398.121994,19.8454584 397.865994,21.6784584 397.812994,22.1344584 C397.673994,23.3284584 397.548994,24.5234584 397.431994,25.7204584 C396.126994,39.0824584 395.641994,52.5344584 395.164994,65.9474584 C394.242994,91.8624584 393.488994,117.797458 392.829994,143.737458 C392.858994,143.743458 392.886994,143.750458 392.915994,143.757458 C397.993994,135.681458 401.267994,126.533458 403.610994,117.324458 Z M409.164994,237.372458 C408.530994,221.198458 405.442994,205.057458 400.261994,189.727458 C398.131994,183.419458 395.578994,176.862458 392.173994,170.877458 C391.565994,197.384458 391.035994,223.891458 390.529994,250.383458 C390.104994,272.657458 389.414994,295.100458 390.772994,317.356458 C390.789994,317.621458 390.809994,317.886458 390.826994,318.152458 C390.970994,317.980458 391.121994,317.813458 391.262994,317.639458 C391.443994,317.385458 392.063994,316.560458 392.249994,316.284458 C407.054994,294.325458 410.184994,263.408458 409.164994,237.372458 Z M325.581994,330.019458 C341.569994,307.133458 345.937994,277.182458 345.595994,249.932458 C345.420994,235.871458 344.354994,221.711458 341.277994,207.965458 C339.927994,201.933458 338.308994,195.765458 335.632994,190.170458 C335.134994,189.129458 334.593994,188.089458 334.022994,187.076458 C333.247994,188.308458 332.453994,189.527458 331.624994,190.718458 C330.515994,192.309458 329.324994,193.906458 328.052994,195.460458 C327.844994,206.883458 327.591994,218.305458 327.249994,229.730458 C326.364994,259.176458 325.033994,288.662458 325.289994,318.127458 C325.324994,322.091458 325.398994,326.058458 325.581994,330.019458 Z M330.316994,63.9294584 C329.493994,82.5774584 329.219994,101.249458 329.007994,119.913458 C328.857994,133.195458 328.728994,146.473458 328.573994,159.749458 C339.359994,133.114458 346.020994,103.494458 345.305994,74.6894584 C344.971994,61.2674584 343.545994,46.1514584 336.233994,34.5804584 C335.061994,32.7254584 335.820994,33.8184584 334.409994,32.3014584 C334.067994,31.9324584 333.681994,31.5784584 333.278994,31.2324584 C333.251994,31.2154584 333.216994,31.1924584 333.181994,31.1684584 C332.219994,35.3394584 332.128994,37.5334584 331.682994,42.3754584 C331.022994,49.5444584 330.633994,56.7374584 330.316994,63.9294584 Z M204,152.583252 C206.04248,152.69458 207.356934,150.950665 207.356934,149.293811 C207.356934,147.636957 206.340576,145.364502 204,145.364502 C201.659424,145.364502 200.484619,147.343146 200.484619,149 C200.484619,150.656854 201.95752,152.471924 204,152.583252 Z"
                  id="Combined-Shape"
                />
              </g>
            </g>
          </>
        );
        break;
      case "driff-logo2":
        viewBox = "0 0 45 33";
        content = (
          <>
            <g id="Welcome" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="logo.d0b06377" fill="#FFFFFF" fillRule="nonzero">
                <path
                  d="M43.1029448,17.6718104 C43.1029448,17.1682795 43.5276991,16.7601093 44.0514724,16.7601093 C44.5753425,16.7601093 45,17.1682795 45,17.6718104 C45,18.1753414 44.5753425,18.5835116 44.0514724,18.5835116 C43.5276991,18.5835116 43.1029448,18.1753414 43.1029448,17.6718104 Z M14.896737,8.87551435 C16.9943492,11.0057661 17.5495139,13.9184605 16.7486427,16.7084151 C15.7301624,20.2562272 12.615717,22.6390361 9.13038677,23.842314 C7.93460252,24.2550474 6.66072702,24.5545398 5.38869239,24.6260604 C5.03796001,24.6458962 4.6513793,24.6528806 4.31353295,24.5497904 C3.73744049,24.373969 3.59986038,23.9139277 3.61468416,23.3921441 C3.74858254,18.6984195 3.8688198,14.0021805 3.80361458,9.30650037 C3.78937213,8.27969573 5.4462435,8.28258263 5.46038906,9.30650037 C5.46969025,9.96834511 5.47492217,10.630283 5.47666615,11.2921278 C5.48354515,13.9014185 5.44440264,16.5107092 5.38559199,19.119348 C5.36359855,20.0926984 5.33850472,21.0658626 5.3109887,22.0391199 C5.30159062,22.3675745 5.30750075,22.7031066 5.29897466,23.0362174 C5.33627631,23.0348205 5.37348107,23.0346343 5.41078272,23.0323993 C5.52152501,23.0257873 5.63217042,23.0163816 5.74252516,23.0052066 C5.80056071,22.9993396 5.8583056,22.9920758 5.91634115,22.9859295 C5.91769758,22.9857433 5.91856956,22.985557 5.91992599,22.9853708 C6.49979706,22.8954113 7.07201402,22.781891 7.63793331,22.6294441 C7.96715668,22.5407884 8.29318277,22.4416095 8.61552714,22.3321867 C8.96732528,22.2127995 9.28317819,22.0920154 9.51357642,21.9937677 C12.5781247,20.6864682 15.0560199,18.3382091 15.4140188,14.9870786 C15.4509329,14.6413026 15.4734108,14.2925467 15.4639158,13.9448151 C15.4606217,13.8263591 15.4537427,13.7080894 15.4434726,13.5900059 C15.4392096,13.5413943 15.4168286,13.378983 15.4124686,13.3371695 C15.3281766,12.8547781 15.1950533,12.3921293 15.0202685,11.9317155 C14.965624,11.78765 14.9983719,11.8752813 14.996531,11.8711838 C14.9666897,11.8058095 14.936364,11.7408077 14.9047787,11.6762716 C14.8448054,11.5541837 14.7811504,11.4338652 14.7139105,11.3154092 C14.568967,11.0599653 14.4073588,10.8132751 14.2303455,10.5771082 C14.2137778,10.5550374 14.1502196,10.4742042 14.1268698,10.4439384 C14.101679,10.41479 14.0349236,10.3360056 14.0144804,10.312631 C13.9132331,10.1972482 13.8082071,10.0850317 13.6997901,9.97598142 C13.4635787,9.73841761 13.2106057,9.51733705 12.9449404,9.31041165 C12.8492157,9.23581791 12.9654805,9.3208417 12.82916,9.22520158 C12.7526189,9.17146801 12.6756903,9.1182932 12.5975022,9.06679466 C12.4481987,8.96817448 12.2955042,8.87430371 12.1400968,8.78471673 C11.7971154,8.58691762 11.4406667,8.41025805 11.074723,8.25511053 C10.3598878,7.95198618 9.38258466,7.68965091 8.53007246,7.53468965 C6.07620536,7.08852413 3.49919438,7.23929474 1.04455218,7.59494202 C0.600517238,7.65929192 0.155804087,7.49408682 0.0255874257,7.03879497 C-0.0828295713,6.65958688 0.161423556,6.12346188 0.604102072,6.05929823 C1.41892508,5.94130789 2.23655782,5.84017331 3.05767851,5.77358839 C7.11357872,5.44438883 11.9284947,5.86094036 14.896737,8.87551435 Z M42.3064625,12.0474429 C42.3675016,11.9467739 42.4139107,11.8379099 42.4723338,11.7364029 C42.8273292,10.7918283 44.4060124,11.2093111 44.0632248,12.1758633 C43.7993036,12.9200313 43.2660353,13.60553 42.6332637,14.0941609 C41.6855112,14.82585 40.569756,15.1221761 39.4227061,15.1283224 C41.1185262,17.9883077 41.5491907,21.5915296 41.1829563,24.8120977 C41.0113687,26.3217594 40.6881524,27.8053459 40.0423979,29.1968311 C39.6683156,30.0028345 39.14057,30.8443189 38.3600451,31.3437523 C37.6849337,31.7757627 36.7129594,31.8163656 36.404373,30.9581186 C36.1936429,30.3722644 36.2045912,29.6770806 36.1790129,29.0639406 C36.0761185,26.6069105 36.1571164,24.1392641 36.2170897,21.6821409 C36.2577824,20.0179836 36.3072918,18.3541056 36.3539916,16.6901346 C35.6034049,16.9373834 34.8064092,17.0329305 34.0043753,17.0152366 C34.6153472,18.2605143 34.8528182,19.6673651 35.0042532,21.0227174 C35.1664427,22.4742687 35.2089763,23.9630702 35.0583164,25.4173221 C34.8765556,27.1718114 34.4217662,28.894638 33.6081058,30.4796384 C33.1725001,31.327921 32.5546492,32.4045479 31.6290839,32.8416802 C29.436619,33.8771455 29.8525566,29.5304075 29.8600169,28.581456 C29.8842387,25.5253479 30.0214313,22.4706368 30.1074673,19.4157393 C29.8465495,19.4955481 29.5696454,19.5338228 29.2760766,19.5160358 C28.1969447,19.4508477 27.547121,18.6164409 27.1777862,17.7261586 C27.0312925,18.1683197 26.8635804,18.6033102 26.6664145,19.0266599 C26.138572,20.159721 25.2101969,21.1218032 23.8158904,20.6099841 C22.1371225,19.9937709 22.3442678,18.0680233 22.6459751,16.6976777 C22.7731883,16.1196461 22.9358622,15.5499027 23.098633,14.9803456 C22.711471,15.2305745 22.2951458,15.4388037 21.8565366,15.5934856 C21.7631371,15.626359 21.6659591,15.6576492 21.5660682,15.687077 C21.3731654,16.7391187 20.9485079,17.7757015 20.4170805,18.6661701 C19.5455784,20.1267545 18.1439084,21.4225063 16.3549795,21.6916398 C15.9112353,21.7583178 15.4656501,21.5889221 15.3359179,21.1354927 C15.2270165,20.7546084 15.4721416,20.2225809 15.9145294,20.1560891 C17.3450719,19.9408755 18.3277038,18.997884 19.0327534,17.7838035 C19.3642052,17.2131288 19.6352961,16.550539 19.809209,15.897355 C19.227594,15.8487433 18.6827961,15.6547624 18.2926306,15.2276876 C17.4248102,14.2775255 17.7255487,12.747283 18.9233675,12.2078986 C19.6426596,11.8840072 20.4809293,11.8617501 21.0552778,12.4492806 C21.4472842,12.8503732 21.5975566,13.4101521 21.6520073,13.9500953 C21.8646751,13.8552933 22.0711422,13.744008 22.2689862,13.61149 C22.4903739,13.463327 22.7444127,13.2369382 22.9535926,13.0189308 C23.0403068,12.9285057 23.1240175,12.8350075 23.203659,12.7388085 C23.1981364,12.7420679 23.3354258,12.5627077 23.3556753,12.5339319 C23.4689367,12.3731037 23.5743501,12.2065948 23.6958469,12.0018113 C24.0417349,11.2043754 25.2909042,11.2596921 25.3230708,12.213393 C25.3772308,13.8198124 24.6355578,15.4238105 24.2778495,16.9698843 C24.2037307,17.2903301 24.1293212,17.66125 24.1055837,17.9137139 C24.09076,18.0719346 24.0808775,18.2308071 24.0831059,18.3896797 C24.0840747,18.4504908 24.1135285,18.7030479 24.1034522,18.6766933 C24.1205044,18.7448613 24.1568372,18.8710467 24.172436,18.9267359 C24.1847407,18.9540218 24.2133225,19.0030991 24.2955799,19.0753647 C24.3147636,19.0876573 24.3660171,19.1112181 24.3839412,19.1206238 C24.4459492,19.1399939 24.5335354,19.1647654 24.6310041,19.1598297 C24.6876832,19.1084243 24.7416495,19.0554357 24.7950345,18.997884 C24.8310766,18.9464786 24.8674093,18.8956319 24.9015137,18.8430159 C25.2245363,18.3460037 25.3205517,18.058152 25.511323,17.5024706 C25.9272606,16.29137 26.1940885,15.0315648 26.419061,13.7763226 C26.4929861,13.3643343 26.5599353,12.9511353 26.6216525,12.5371913 C26.6450993,12.271131 26.6793974,12.0069332 26.7320073,11.7476711 C26.9100863,10.8699608 28.4667761,11.0725093 28.3592311,11.9593459 C28.3408225,12.1103959 28.3197011,12.2610734 28.2994516,12.4119371 C28.2884064,12.5299275 28.2776519,12.6477315 28.2701916,12.7660013 C28.2136094,13.6663411 28.2305647,14.5767385 28.3312307,15.4735396 C28.3726985,15.8428764 28.4521461,16.3016139 28.5820721,16.7498282 C28.7101573,17.1913374 28.7530784,17.3503962 29.0195187,17.7082785 C28.952182,17.6149665 29.1227038,17.8105306 29.1736666,17.8583041 C29.1973071,17.8735767 29.2241449,17.8888493 29.2543738,17.9122239 C29.2685193,17.9140864 29.2884781,17.9168802 29.4022239,17.9297316 C29.4127847,17.9296384 29.4524116,17.9265653 29.55705,17.9102683 C29.602684,17.9008626 29.6467677,17.8858693 29.696471,17.8701311 C29.8949932,17.7775641 30.0084484,17.6922609 30.150776,17.5657961 C30.2156905,14.0228265 30.1859461,10.478367 30.3077336,6.93642183 C30.3564679,5.518489 30.3885376,4.07187344 30.6469363,2.67135513 C30.7178579,2.28711824 30.8177488,1.85603909 31.1064733,1.56362421 C31.481815,1.1836711 32.1429746,1.16374219 32.6343875,1.3123709 C33.8964427,1.69390714 34.4810613,3.11044309 34.7658133,4.23214287 C35.1862078,5.88810514 35.2082981,7.66000898 34.9929174,9.34549208 C34.7977862,10.8719164 34.4549017,12.3809262 33.9716274,13.8470051 C33.80159,14.3625493 33.616535,14.8839604 33.405805,15.3968971 C33.4545393,15.4015534 33.5149002,15.4064891 33.6026801,15.4134735 C34.528633,15.4877879 35.1340823,15.4371274 35.9693486,15.1409875 C36.10751,15.0920034 36.2533255,15.0243941 36.4010788,14.9437472 C36.4137711,14.4509256 36.4266571,13.9581972 36.437896,13.4652826 C36.5178281,9.91905364 36.5106585,6.35066079 36.8107187,2.81327878 C36.8723391,2.08717723 36.8283522,0.919752701 37.4004723,0.344794257 C38.040898,-0.298704748 39.0688733,0.0582462923 39.6244256,0.602845739 C40.4143486,1.37727956 40.7942441,2.52579956 41.0103998,3.56266178 C41.372468,5.29945721 41.3527999,7.09725001 41.1509835,8.85136684 C40.9703853,10.4203496 40.6276946,12.0943783 39.8758484,13.5345682 C39.992404,13.5222756 40.1079906,13.5052335 40.2219302,13.4815796 C40.5341014,13.4168572 40.8265076,13.3223346 41.0228983,13.2196168 C41.2722865,13.0892408 41.4687741,12.9684567 41.5771911,12.8771003 C41.748488,12.732476 41.9057363,12.5779804 42.0529082,12.411099 C42.0624032,12.3984339 42.124508,12.3220708 42.1724673,12.253344 C42.2193608,12.1861072 42.2641228,12.1173803 42.3064625,12.0474429 Z M27.7098627,10.1090768 C27.1859926,10.1090768 26.7613351,9.70090655 26.7613351,9.1973756 C26.7613351,8.69384461 27.1859926,8.28567441 27.7098627,8.28567441 C28.233636,8.28567441 28.6583903,8.69384461 28.6583903,9.1973756 C28.6583903,9.70090655 28.233636,10.1090768 27.7098627,10.1090768 Z M39.1048185,10.9259294 C39.5057386,9.41179763 39.6548483,7.82400345 39.6349864,6.26424009 C39.6194844,5.05239457 39.4604922,3.63939741 38.998533,2.59713389 C38.9119157,2.40147667 38.8083431,2.21028949 38.6913031,2.02990489 C38.6534201,1.97132879 38.613115,1.91368394 38.5711627,1.85734285 C38.569225,1.87010108 38.5670935,1.88295244 38.5651557,1.89571067 C38.5730036,1.8481234 38.5482004,2.01882292 38.5430654,2.06128827 C38.529598,2.17248043 38.5174871,2.28376571 38.5061513,2.39523725 C38.3797132,3.63958366 38.3327229,4.89231139 38.2865076,6.14140721 C38.1971774,8.55476129 38.1241243,10.9699778 38.0602755,13.3856601 C38.0630852,13.3862188 38.0657981,13.3868707 38.0686078,13.3875226 C38.560602,12.6354389 38.8778114,11.7835245 39.1048185,10.9259294 Z M39.6429311,22.1054906 C39.5815045,20.5992746 39.2823162,19.0961317 38.7803426,17.6685138 C38.5739725,17.0810765 38.326619,16.4704509 37.9967174,15.9130932 C37.9378098,18.3815777 37.8864595,20.8500623 37.8374345,23.3171499 C37.7962573,25.3914331 37.729405,27.4814545 37.8609781,29.5540615 C37.8626252,29.5787398 37.864563,29.6034181 37.86621,29.6281896 C37.8801618,29.6121719 37.8947918,29.5966199 37.9084529,29.5804161 C37.9259896,29.5567621 37.9860598,29.4799334 38.0040808,29.4542307 C39.4384987,27.4092821 39.7417563,24.5301129 39.6429311,22.1054906 Z M31.5447918,30.733313 C33.0938275,28.6020368 33.5170317,25.8128272 33.4838962,23.2751502 C33.4669409,21.9657089 33.3636589,20.6470481 33.0655364,19.3669414 C32.9347384,18.8052068 32.7778777,18.2308071 32.5186071,17.7097685 C32.4703571,17.6128246 32.4179411,17.5159738 32.3626184,17.4216374 C32.2875306,17.5363683 32.210602,17.6498886 32.1302824,17.7608014 C32.0228343,17.9089645 31.9074414,18.0576863 31.7842006,18.2024038 C31.764048,19.2661793 31.7395355,20.3298618 31.7064,21.3938236 C31.6206547,24.1360047 31.4916975,26.8819109 31.5165007,29.6258614 C31.5198918,29.9950119 31.5270614,30.3644418 31.5447918,30.733313 Z M32.0035537,5.95347943 C31.9238153,7.6900886 31.8972682,9.42893277 31.8767281,11.167032 C31.8621949,12.4039283 31.8496965,13.6404522 31.8346789,14.8767897 C32.8797064,12.3963851 33.5250733,9.6380001 33.4557989,6.95551261 C33.4234385,5.70557865 33.285277,4.29788966 32.5768364,3.22033148 C32.4632844,3.0475832 32.5368219,3.14936965 32.4001138,3.00809788 C32.3669783,2.97373447 32.3295798,2.94076795 32.2905341,2.90854644 C32.2879182,2.9069633 32.2845271,2.90482141 32.2811361,2.90258639 C32.1879304,3.29101394 32.1791136,3.49533185 32.1359018,3.94624679 C32.0719562,4.61386536 32.034267,5.28371896 32.0035537,5.95347943 Z M19.7650289,14.2094314 C19.9629195,14.2197989 20.0902735,14.0573955 20.0902735,13.9030997 C20.0902735,13.7488039 19.9918013,13.5371798 19.7650289,13.5371798 C19.5382566,13.5371798 19.4244328,13.7214425 19.4244328,13.8757383 C19.4244328,14.0300341 19.5671384,14.1990639 19.7650289,14.2094314 Z"
                  id="Combined-Shape"
                ></path>
              </g>
            </g>
          </>
        );
        break;
      default:
        console.log(`${icon} not found`);
    }

    return (
      <Svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        stroke-linecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        className={`icon-${icon} ${className}`}
        {...rest}
      >
        {content}
      </Svg>
    );
  })
);

export const SvgEmptyState = React.memo(
  React.forwardRef((props, ref) => {
    const { className = "", width = "100%", height = "100%", fill = "none", stroke = "", strokeWidth = "", strokeLinecap = "", strokeLinejoin = "", icon, ...rest } = props;

    let iconSet = icon;
    let content = "";
    let viewBox = `0 0 ${width} ${height}`;

    if (typeof iconSet === "undefined") iconSet = Math.floor(Math.random() * 4) + 1;

    switch (iconSet) {
      case 1:
        viewBox = "0 0 483 421";
        content = (
          <>
            <g transform="translate(-358 -223)">
              <g transform="translate(358 414)" opacity="0.346">
                <path d="M.121-123.043C4.174-68.048,221.6,38.1,261.962-13.992s1.559-149.85-83.029-174.883S-3.931-178.038.121-123.043Z" transform="translate(278) rotate(180)" fill="#f2f2f2" fillRule="evenodd" />
                <path d="M244.079,158.351c3.4-46.641,185.885-136.662,219.762-92.485s25.3,137.1-45.692,158.329S240.678,204.992,244.079,158.351Z" fill="#dde3e9" fillRule="evenodd" />
              </g>
              <g transform="translate(387 223)">
                <g transform="translate(15)">
                  <rect width="324" height="283" rx="8" fill="#f2f2f2" />
                  <path d="M8,0H316a8,8,0,0,1,8,8V22H0V8A8,8,0,0,1,8,0Z" fill="#c5cfd6" fillRule="evenodd" />
                  <g transform="translate(9 10)">
                    <circle cx="4" cy="4" r="4" fill="#f2f2f2" />
                    <circle cx="4" cy="4" r="4" transform="translate(12)" fill="#f2f2f2" />
                    <circle cx="4" cy="4" r="4" transform="translate(24)" fill="#f2f2f2" />
                  </g>
                  <g transform="translate(16 43)">
                    <g transform="translate(222 89)">
                      <rect width="70" height="135" rx="8" fill="#fff" />
                      <g transform="translate(18 18)">
                        <rect width="34" height="17.284" rx="4" fill="#dde3e9" />
                        <rect width="34" height="16.619" rx="4" transform="translate(0 22.602)" fill="#cca8d2" />
                        <rect width="34" height="16.619" rx="4" transform="translate(0 44.54)" fill="#dde3e9" />
                        <rect width="34" height="16.619" rx="4" transform="translate(0 88.415)" fill="#dde3e9" />
                        <rect width="34" height="16.619" rx="4" transform="translate(0 66.477)" fill="#c5cfd6" />
                      </g>
                    </g>
                    <g transform="translate(222)">
                      <rect width="70" height="64.113" rx="8" fill="#fff" />
                      <g transform="translate(10 11.873)">
                        <circle cx="16" cy="16" r="16" transform="translate(9)" fill="#dde3e9" />
                        <rect width="50" height="6" rx="3" transform="translate(0 36)" fill="#dde3e9" />
                        <rect width="34" height="6" rx="3" transform="translate(8 46)" fill="#dde3e9" />
                      </g>
                    </g>
                    <rect width="214" height="37.201" rx="4" fill="#fff" />
                    <g transform="translate(9 11.16)">
                      <rect width="156" height="5.58" rx="2.79" fill="#dde3e9" />
                      <rect width="104.712" height="5.58" rx="2.79" transform="translate(0 9.3)" fill="#dde3e9" />
                    </g>
                    <g transform="translate(184.13 11.601)">
                      <circle cx="7" cy="7" r="7" fill="#dde3e9" />
                      <circle cx="3" cy="3" r="3" transform="translate(4 4)" fill="#f2f2f2" />
                    </g>
                    <g transform="translate(0 43.534)">
                      <rect width="214" height="30.869" rx="4" fill="#fff" />
                      <g transform="translate(9 9.261)">
                        <rect width="156" height="4.63" rx="2.315" fill="#dde3e9" />
                        <rect width="104.712" height="4.63" rx="2.315" transform="translate(0 7.717)" fill="#dde3e9" />
                      </g>
                      <g transform="translate(184.13 8.435)">
                        <circle cx="7" cy="7" r="7" fill="#dde3e9" />
                        <circle cx="3" cy="3" r="3" transform="translate(4 4)" fill="#f2f2f2" />
                      </g>
                    </g>
                    <g transform="translate(0 80.735)">
                      <rect width="214" height="30.869" rx="4" fill="#fff" />
                      <g transform="translate(9 9.261)">
                        <rect width="156" height="4.63" rx="2.315" fill="#dde3e9" />
                        <rect width="104.712" height="4.63" rx="2.315" transform="translate(0 7.717)" fill="#dde3e9" />
                      </g>
                      <g transform="translate(184.13 8.435)">
                        <circle cx="7" cy="7" r="7" fill="#dde3e9" />
                        <circle cx="3" cy="3" r="3" transform="translate(4 4)" fill="#afb9c5" />
                      </g>
                    </g>
                    <g transform="translate(0 192.339)">
                      <rect width="214" height="30.869" rx="4" fill="#fff" />
                      <g transform="translate(9 9.261)">
                        <rect width="156" height="4.63" rx="2.315" fill="#dde3e9" />
                        <rect width="104.712" height="4.63" rx="2.315" transform="translate(0 7.717)" fill="#dde3e9" />
                      </g>
                      <g transform="translate(184.13 8.435)">
                        <circle cx="7" cy="7" r="7" fill="#dde3e9" />
                        <circle cx="3" cy="3" r="3" transform="translate(4 4)" fill="#f2f2f2" />
                      </g>
                    </g>
                    <g transform="translate(0 155.138)">
                      <rect width="214" height="30.869" rx="4" fill="#fff" />
                      <g transform="translate(9 9.261)">
                        <rect width="156" height="4.63" rx="2.315" fill="#dde3e9" />
                        <rect width="104.712" height="4.63" rx="2.315" transform="translate(0 7.717)" fill="#dde3e9" />
                      </g>
                      <g transform="translate(184.13 8.435)">
                        <circle cx="7" cy="7" r="7" fill="#dde3e9" />
                        <circle cx="3" cy="3" r="3" transform="translate(4 4)" fill="#f2f2f2" />
                      </g>
                    </g>
                    <g transform="translate(0 117.936)">
                      <rect width="214" height="30.869" rx="4" fill="#fff" />
                      <g transform="translate(9 9.261)">
                        <rect width="156" height="4.63" rx="2.315" fill="#dde3e9" />
                        <rect width="104.712" height="4.63" rx="2.315" transform="translate(0 7.717)" fill="#dde3e9" />
                      </g>
                      <g transform="translate(184.13 8.435)">
                        <circle cx="7" cy="7" r="7" fill="#dde3e9" />
                        <circle cx="3" cy="3" r="3" transform="translate(4 4)" fill="#f2f2f2" />
                      </g>
                    </g>
                  </g>
                </g>
                <g transform="translate(425 92) rotate(180)">
                  <g transform="translate(425 -0.798) rotate(-180)">
                    <g transform="translate(38.024 13.84) rotate(-8)">
                      <g transform="translate(38.515 22.058)">
                        <path
                          d="M27.205,6.5c4.133,7.685,3.642,27.18-1.7,28.554-2.13.548-6.668-.794-11.287-3.571l2.9,20.461H0l5.893-27.4C2.606,20.692.382,15.976.754,10.691,1.825-4.536,23.072-1.186,27.205,6.5Z"
                          fill="#b28b67"
                          fillRule="evenodd"
                        />
                      </g>
                      <path
                        d="M58.959,20.186A22.392,22.392,0,0,0,51.8,19.4a12.264,12.264,0,0,0,.872-6.213,18.9,18.9,0,0,0-2.02-5.617,7.682,7.682,0,0,0-1.494-2.323,5.107,5.107,0,0,0-2.418-1.3,6.484,6.484,0,0,0-2.785,0c-.4.085-.768.27-1.165.372s-.6-.149-.9-.4a5.1,5.1,0,0,0-2.654-1.027,6.859,6.859,0,0,0-3.02.361A5.913,5.913,0,0,0,33.7,4.858a4.207,4.207,0,0,0-.754,1.152c-.073.175-.085.279-.26.343s-.351.061-.518.118a6.517,6.517,0,0,0-3.75,3.391,10.728,10.728,0,0,0-.59,4.417c.057,1.841,1.724,6.646,3.282,8.4a10.478,10.478,0,0,0,5.41,3.048,15.43,15.43,0,0,0-2.827,5.259A25.684,25.684,0,0,0,32.4,37.374a20.8,20.8,0,0,0,.321,6.3,6.826,6.826,0,0,0,3.059,4.444,14.628,14.628,0,0,0,2.355,1.1A15.528,15.528,0,0,0,40.558,50a4.877,4.877,0,0,0,4.608-.983,8.634,8.634,0,0,0,1.239-1.57c.115-.2.184-.328.045-.522a3.738,3.738,0,0,0-.652-.592,6.127,6.127,0,0,1-2.173-4.06c-.194-1.667.255-3.818,1.879-4.545,2-.9,4.213.133,6,1.093a9.781,9.781,0,0,1,4.751-6.291c2.7-1.353,5.792-1.512,8.564-2.673a5.111,5.111,0,0,0,1.99-1.263,2.566,2.566,0,0,0,.572-.933,1.508,1.508,0,0,0-.4-1.172C65.793,24.636,61.3,20.9,58.959,20.186Z"
                        fill="#191847"
                        fillRule="evenodd"
                      />
                    </g>
                    <g transform="translate(0 137.187)">
                      <path d="M92.3,0l52.758,87.842,39.553,74.263h8.519L126.858,0Z" fill="#915b3c" fillRule="evenodd" />
                      <g transform="translate(177.5 140.715)">
                        <path
                          d="M1.66,18.4A13.363,13.363,0,0,0,.7,22.474,34.889,34.889,0,0,0,1.34,28H41.1q1.55-5.088-1.789-5.493t-5.548-.733l-18.206-8.06a1,1,0,0,0-1.319.51l-.009.021-1.072,2.582h0a12.746,12.746,0,0,1-5.024,1.432,10.389,10.389,0,0,1-3.8-1.023h0A2,2,0,0,0,1.7,18.287Q1.681,18.344,1.66,18.4Z"
                          fill="#e4e4e4"
                          fillRule="evenodd"
                        />
                      </g>
                      <path d="M173.626,150.214l16.429-4.95q-10.8-32.147-26.467-70.753T129.93,0h-46.4a725.656,725.656,0,0,0,42.4,82.538A558.652,558.652,0,0,0,173.626,150.214Z" fill="#571563" fillRule="evenodd" />
                      <path d="M88.833,0C83.853,30.868,74.25,70.306,73.343,71.524Q72.437,72.741,8.087,93.3l1.84,7.482Q86.665,89.756,90.8,83.673C94.926,77.59,115.551,29.531,123.54,0Z" fill="#915b3c" fillRule="evenodd" />
                      <path d="M23.167,86.834l3.241,12.05q57.4,5.013,70.335-7.245T126.237,0H81.989Q71.5,65,70.262,67.731T23.167,86.834Z" fill="#7a1b8b" fillRule="evenodd" />
                      <g transform="translate(27.562 85.114) rotate(80)">
                        <path
                          d="M1.66,18.4A13.363,13.363,0,0,0,.7,22.474,34.889,34.889,0,0,0,1.34,28H41.1q1.55-5.088-1.789-5.493t-5.548-.733l-18.206-8.06a1,1,0,0,0-1.319.51l-.009.021-1.072,2.582h0a12.746,12.746,0,0,1-5.024,1.432,10.389,10.389,0,0,1-3.8-1.023h0A2,2,0,0,0,1.7,18.287Q1.681,18.344,1.66,18.4Z"
                          fill="#e4e4e4"
                          fillRule="evenodd"
                        />
                      </g>
                    </g>
                    <g transform="translate(3.93 77.259) rotate(-8)">
                      <path
                        d="M48.322,52.553l15.568.058q-25.606,57.212-26.7,59.911c-1.645,4.048,1.836,10.213,3.325,13.526-4.849,2.154-4.332-5.824-10.448-3-5.583,2.579-9.83,7.252-16.28,3.3-.793-.486-1.662-2.315.438-3.745,5.231-3.561,12.769-9.794,13.787-11.846q2.083-4.2,20.313-58.206ZM180.36,39.046c-3.145,2.6-6.336,5.483-5.776,6.873s3.485.872,3.97,3.009q.485,2.137-14.241.694l-22.776,8.966L136.5,46.1l28.07-3.8a61.441,61.441,0,0,1,15.5-6.3C181.394,35.964,183.505,36.443,180.36,39.046Z"
                        fill="#997659"
                        fillRule="evenodd"
                      />
                      <path
                        d="M87.805,6.848l12.213-.259c5.341,26.6,23.114,42.144,59.082,33.209l7.872,34.169c-33.7,7.356-64.784-3.578-74.12-39.729C90.434,24.88,88.317,15.106,87.805,6.848Z"
                        transform="translate(4.09 -10.945) rotate(5)"
                        fill="#cca8d2"
                        fillRule="evenodd"
                      />
                      <path d="M84.941,0l.009.011,18.468,4.2c0,31.184,9.892,51.207,15.131,74.068l.177.78H68.85c-.7,8.012-1.134,16.248-1.359,24.706H30.145Q42.839,36.7,83.731,0h1.21Z" fill="#c5cfd6" fillRule="evenodd" />
                      <path d="M76.719,34.066q-1.928,29.479,2.268,44.993H68.85a241.428,241.428,0,0,1,7.785-44.7Z" fill="rgba(0,0,0,0.1)" fillRule="evenodd" />
                    </g>
                  </g>
                  <g transform="translate(73.688 -0.631) rotate(-7)">
                    <g transform="translate(38.515 -22.058)">
                      <path
                        d="M27.205-6.5c4.133-7.685,3.642-27.18-1.7-28.554-2.13-.548-6.668.794-11.287,3.571l2.9-20.461H0l5.893,27.4C2.606-20.693.382-15.976.754-10.691,1.825,4.536,23.072,1.186,27.205-6.5Z"
                        fill="#b28b67"
                        fillRule="evenodd"
                      />
                    </g>
                    <path
                      d="M55.963-19.7c-2.256.369-8.331.623-9.451.623-.716,0-1.492-.163-1.916.493-.347.537-.22,1.445-.324,2.068-.12.724-.291,1.439-.464,2.151a21.843,21.843,0,0,1-2.277,5.77A17.762,17.762,0,0,1,33.106-.984,27.117,27.117,0,0,1,20.313.771C15.722.4,11.566-1.112,7.231-2.535A27.48,27.48,0,0,0-5.548-3.762C-9.9-3.1-13.19-.741-16.862,1.493a21.115,21.115,0,0,1-12.5,3.439A24.1,24.1,0,0,1-40.761.619,18.57,18.57,0,0,1-48.113-7.7c-1.608-3.89-1.607-8.16,1.038-11.6,3.833-4.983,10.95-6.272,16.871-6.144a32.3,32.3,0,0,1,10.021,1.832c4.312,1.513,8.038,4.078,12.072,6.158a31.458,31.458,0,0,0,5.9,2.356c1.99.561,3.951.818,5.753-.382a27.184,27.184,0,0,1,5.8-3.31,18.731,18.731,0,0,1,6.537-1.171c4.337.033,8.612,1.382,12.824,2.284,3.435.736,7.11,1.47,10.612.762,1.461-.3,3.6-.905,4.123-2.42C34.552-20.939,31.063-31.9,33.568-39.944c1.352-4.342,9.476-9.419,12.635-7.136,2,1.446.786,3.345,0,4.6-1.506,2.4-2.021,5.484.765,7.155,2.4,1.441,4.93-1.981,4.978-1.978.661.052,6.368,3.272,10.3,7.972,3.88-.229,4.468,2.323,3.542,4.41S59.081-20.21,55.963-19.7Z"
                      fill="#191847"
                      fillRule="evenodd"
                    />
                  </g>
                  <g transform="translate(0 -137.985)">
                    <path
                      d="M147.082,6.97C133.562-4.06,138.9-101,138-102.223q-.6-.812-64.354-13.723l1.85-7.506q74.6,3.565,78.934,9.1,6.21,7.927,15.218,88.773Z"
                      transform="matrix(0.574, 0.819, -0.819, 0.574, 4.164, -124.48)"
                      fill="#b28b67"
                      fillRule="evenodd"
                    />
                    <path
                      d="M147.082,6.97C133.562-4.06,138.9-101,138-102.223q-.6-.812-64.354-13.723l1.85-7.506q74.6,3.565,78.934,9.1,6.21,7.927,15.218,88.773Z"
                      transform="matrix(0.574, 0.819, -0.819, 0.574, 4.164, -124.48)"
                      fill="rgba(0,0,0,0.1)"
                      fillRule="evenodd"
                    />
                    <path
                      d="M80.832-108.06l3.256-12.089c37.082-4.334,61.513.9,70.1,9.074q8.587,8.178,15.258,88.532L145.309,11.928c-32.188-24.291-12.822-104.05-13.642-105.872S111.3-97.172,80.832-108.06Z"
                      transform="matrix(0.574, 0.819, -0.819, 0.574, 8.398, -125.914)"
                      fill="#2f3676"
                      fillRule="evenodd"
                    />
                    <g transform="translate(143.09 -111.732) rotate(-20)">
                      <path
                        d="M1.66-18.4A13.363,13.363,0,0,1,.7-22.474,34.889,34.889,0,0,1,1.34-28H41.1q1.55,5.088-1.789,5.493t-5.548.733l-18.206,8.06a1,1,0,0,1-1.319-.51l-.009-.021-1.072-2.582h0a12.746,12.746,0,0,0-5.024-1.432,10.389,10.389,0,0,0-3.8,1.023h0A2,2,0,0,1,1.7-18.287Q1.681-18.344,1.66-18.4Z"
                        fill="#e4e4e4"
                        fillRule="evenodd"
                      />
                    </g>
                    <path d="M92.3,0,55.56-87.842,19.451-162.106H27.97L121.178,0Z" fill="#b28b67" fillRule="evenodd" />
                    <g transform="translate(17.04 -140.715)">
                      <path
                        d="M1.66-18.4A13.363,13.363,0,0,1,.7-22.474,34.889,34.889,0,0,1,1.34-28H41.1q1.55,5.088-1.789,5.493t-5.548.733l-18.206,8.06a1,1,0,0,1-1.319-.51l-.009-.021-1.072-2.582h0a12.746,12.746,0,0,0-5.024-1.432,10.389,10.389,0,0,0-3.8,1.023h0A2,2,0,0,1,1.7-18.287Q1.681-18.344,1.66-18.4Z"
                        fill="#e4e4e4"
                        fillRule="evenodd"
                      />
                    </g>
                    <path d="M22.712-146.678l18.93-3.536C56.279-128.783,117.534-40.908,124.25,0H82.107C59.679-29.572,36.664-124.893,22.712-146.678Z" fill="#5c63ab" fillRule="evenodd" />
                  </g>
                  <g transform="translate(24.357 -53.066) rotate(-7)">
                    <path
                      d="M36.619-57.883l14.568-2.87q-21.976-40.664-23.571-43.1c-2.392-3.66-.16-10.367.664-13.9-5.172-1.2-3.132,6.534-9.677,4.92-5.974-1.473-11.039-5.253-16.61-.155-.685.627-1.186,2.586,1.149,3.591,5.817,2.5,14.412,7.191,15.806,9.011Q21.8-96.667,36.619-57.883Zm144.093,21.7c-2.291-3.322-4.55-6.918-3.634-8.082s3.567.121,4.614-1.772q1.047-1.893-13.408-4.529L148.992-65.252l-8.226,10.463,25.761,11.233A60.987,60.987,0,0,0,179.6-33.376C180.856-32.978,183-32.858,180.713-36.18Z"
                      fill="#b28b67"
                      fillRule="evenodd"
                    />
                    <path
                      d="M87.667-6.995,93.7-5.416c14.463-11.68,22.607-42.07,31.854-45.378,8.743-3.127,20.33,1.653,34.05,7.939l5.179-9.242c-11.658-14.948-38.049-29.024-49.744-23.329C96.341-66.322,88.909-28.612,87.667-6.995Z"
                      transform="translate(4.06 10.845) rotate(-5)"
                      fill="#571563"
                      fillRule="evenodd"
                    />
                    <path d="M63.985-80.471h54.4c2.486,0,2.017,3.564,1.658,5.362C115.891-54.356,99.7-31.985,99.7-2.443L84.013,0C71.035-20.724,66.547-46.239,63.985-80.471Z" fill="#dde3e9" fillRule="evenodd" />
                    <path d="M85.833,0h3.38q21.128-71.51,11.649-95.294H51.9a176.356,176.356,0,0,0,6.662,35.84Q41.927-89.248,30.6-102.353l-11.4,2.217Q30.212-32.3,83,0Z" fill="#7a1b8b" fillRule="evenodd" />
                  </g>
                </g>
                <g transform="translate(124.465 120.816) rotate(-14)">
                  <path d="M50.828,54.607l-.007.016s.007-.025.007-.016" fill="#c5cfd6" fillRule="evenodd" />
                  <path d="M50.823,54.614a.043.043,0,0,0,0,.005c0-.005.009-.02,0-.005" fill="#c5cfd6" fillRule="evenodd" />
                  <path d="M50.858,54.53c-.007.02-.016.039-.024.059l.012-.028c-.1.26-.038.091.012-.031" fill="#c5cfd6" fillRule="evenodd" />
                  <path d="M50.836,54.59l-.012.028c-.029.056.012-.028.012-.028" fill="#c5cfd6" fillRule="evenodd" />
                  <path d="M50.825,54.614Z" fill="#c5cfd6" fillRule="evenodd" />
                  <path d="M50.824,54.615v0" fill="#c5cfd6" fillRule="evenodd" />
                  <path d="M50.819,54.622c-.006.012.028-.046,0,0" fill="#c5cfd6" fillRule="evenodd" />
                  <path d="M50.824,54.615l0,0,0,0" fill="#c5cfd6" fillRule="evenodd" />
                  <rect width="100" height="66" rx="4" transform="translate(0.575 0.818)" fill="#571563" />
                  <g transform="translate(9.058 20.093)">
                    <path d="M29.312,0,.471,47H58.152Z" fill="rgba(0,0,0,0.2)" fillRule="evenodd" />
                    <path d="M59.047,12.589,33.551,47H84.544Z" fill="rgba(0,0,0,0.2)" fillRule="evenodd" />
                  </g>
                  <circle cx="9.5" cy="9.5" r="9.5" transform="translate(69.517 14.142)" fill="#fff" />
                </g>
              </g>
            </g>
          </>
        );
        break;
      case 2:
        viewBox = "0 0 483 434.869";
        content = (
          <>
            <g transform="translate(-358 -209.131)">
              <g transform="translate(512 209)" opacity="0.5">
                <path
                  d="M1.908,2.672C.335,4.243.946,9.824.913,11.89c-.051,3.216.149,6.4.418,9.606.18,2.145,1.2,22.618,4.021,21.045,1.593-.886.594-6.808.591-8.681-.006-4.164-.18-8.319-.457-12.474A109.174,109.174,0,0,1,5.215,9.851c.036-.943.919-11.412-3.307-7.179"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path
                  d="M70.409.149C56.9.256,43.388.923,29.881,1.331c-6.5.2-12.995.446-19.487.807-2.212.123-6.957-.585-8.8.593C-2.5,5.348,4.1,5.96,5.859,5.9,32.59,4.927,59.329,3.65,86.082,3.59c13.124-.029,26.241.344,39.365.261,5.017-.032,10.573-2.193,11.84,3.646,1.43,6.59-.213,13.927-.66,20.548a116.174,116.174,0,0,0,.007,13.166c.128,2.829-.2,6.018.3,8.794.481,2.674,2.4,4.277,4.166,1.282,1.053-1.79.529-6.209.6-8.282.094-2.792.006-5.584.006-8.377,0-6.817.962-13.607.834-20.422-.082-4.395-.315-12.362-5.858-13.418-6.1-1.163-13.607.006-19.853-.065C101.344.546,85.892.028,70.409.149"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path
                  d="M33.174,42.786q-7.643,0-15.287.115c-4.37.072-11.24-.839-15.308.725C-.2,44.7-.944,47.8,2.58,48.633c3.843.9,9.636-.573,13.657-.644,20.164-.356,40.522-.82,60.658.455,18.868,1.195,38.1,2.353,56.994,1.092,1.59-.106,9.7-.429,6-3.468-2.158-1.774-10.907-.607-13.712-.692-9.894-.3-19.8-.365-29.69-.74C86.722,44.265,77,43.168,67.238,42.9c-11.345-.316-22.716-.11-34.065-.11"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path
                  d="M28.075,13.8c7.942.347,15.8,11.865,7.764,17.431-7.539,5.223-21.667-.5-17.475-10.629-.6,1.464.762-1.591.779-1.611a21.789,21.789,0,0,1,3.211-2.719,12.686,12.686,0,0,1,3.651-2.2c.89-.279.75.77,2.07-.267M24.207,9.65C20.49,11.1,18.794,12.738,16.239,15.7c-1.768,2.05-4.021,3.129-4,5.9,0,.613.792,1.287.928,1.878.188.816-.03,1.862.119,2.729C14.824,35.156,25.5,38.174,33.317,36.484c6.808-1.472,11.9-8.007,10.323-15.114C42.052,14.216,31.444,6.819,24.207,9.65"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path d="M20.9,22.143c0,3.219,5.085,3.219,5.085,0,0-3.183-5.085-3.319-5.085,0" fill="#ddc8e1" fillRule="evenodd" />
                <path d="M27.258,21.491c0,2.558,4.041,2.558,4.041,0,0-2.529-4.041-2.637-4.041,0" fill="#ddc8e1" fillRule="evenodd" />
                <path d="M28.51,26.767c-1.294.5-2.935-.534-4,.146-1.881,1.2,0,2.294,1.013,2.778,4.54,2.179,5.348-3.829,2.984-2.924" fill="#ddc8e1" fillRule="evenodd" />
                <path
                  d="M97.85,19.632h0m-19.772-2.89c-3.4.767-6.267,3.941-9.959,3.516-2.829-.325-4.745-3.056-7.538-3.452-3.573-.508-13.3,7.643-8.185,9.041,2.983.816,4.638-4.635,7.273-4.925,2.085-.229,4.92,2.327,7.08,2.691,4.03.679,6.8-1.541,10.335-2.972,3.844-1.556,6.032-.155,9.375,1.574,2.639,1.365,5.124,2.253,8.144,1.69,2.834-.528,6.394-3.442,9.247-3.143,2.794.293,4.788,3.209,7.662,3.479,1.185.111,2.949.515,2.749-1.313-.159-1.464-1.793-1.216-2.814-1.748-2.628-1.368-5.086-3.792-8.257-3.585-2.386.156-4.557,1.832-6.756,2.634-7.2,2.626-11.248-5.081-18.356-3.487"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path
                  d="M84.092,63.111c-13.889.127-27.824.334-41.674,1.447-3.283.264-36.81,3.429-36.747,3.657.118.422,4.43,1.066,4.4,1.166q-.436-1.081-1.993-.895c31.8,0,63.494-2.847,95.334-2.335,8,.128,16.03.075,24.025.327,2,.063,6.941,1.494,8.509.592,4.114-2.365-3.36-2.638-4.6-2.738-15.669-1.253-31.546-1.379-47.259-1.222"
                  fill="#69a1ac"
                  fillRule="evenodd"
                />
                <path
                  d="M1.556,69.859c-2.076,2.082-.164,9.571-.083,12.385.118,4.069.021,8.168.378,12.226a82.7,82.7,0,0,0,2.256,14.074c.67,2.478,3.022,6.416,3.953,1.914.665-3.216-.345-7.482-.7-10.759a126.813,126.813,0,0,1-.6-13.112c-.016-3.838-.09-7.691-.4-11.517-.163-1.986-1.163-8.832-4.8-5.212"
                  fill="#69a1ac"
                  fillRule="evenodd"
                />
                <path
                  d="M53.794,108c-9.856.169-19.733.4-29.572,1.017-4.033.253-8.062.629-12.08,1.055-.82.087-9.895.455-5.84,3.8,1.83,1.512,9.359-.578,11.846-.8,4.182-.367,8.364-.6,12.558-.782,9.718-.413,19.467-.777,29.195-.608,17.766.308,35.419.446,53.19.05,2.525-.056,22.306.472,22.978-2.155.541-2.117-6.533-1.146-7.822-1.107-4.732.141-9.464.108-14.2.084-20.051-.1-40.219-.9-60.255-.561"
                  fill="#69a1ac"
                  fillRule="evenodd"
                />
                <path
                  d="M132.719,66.347c.313,8.775,1.807,17.54,2.285,26.342.218,4.024.475,8.043.672,12.068.064,1.3-.46,4.427,1.076,5.174,2.106,1.024,2.39-1.04,2.784-2.436,1.139-4.033.369-9.271.265-13.414-.1-4.011-.107-8.03-.4-12.034-.3-4.091-1.127-8.1-1.509-12.18-.162-1.724.4-4.593-1.427-5.663a2.509,2.509,0,0,0-3.744,2.142"
                  fill="#69a1ac"
                  fillRule="evenodd"
                />
                <path
                  d="M35.845,80.944l.112.087-.112-.087m-8.376-2.6c3.123.892,5.688.56,8.672,2.833,2.473,1.885,5.01,4.643,5.831,7.692,1.9,7.043-4.53,10.9-10.554,10.978-6.17.077-15.3-1.354-14.986-9.262.242-6.076,4.679-12,11.037-12.241m.22-3.98c-8.1.4-14.632,9.5-14.562,17.154.085,9.279,10.6,11.669,18.067,11.734,8.429.072,16.835-5.748,14.576-15.227-1.81-7.595-10.292-14.066-18.081-13.661"
                  fill="#69a1ac"
                  fillRule="evenodd"
                />
                <path d="M19.542,86.822c0,2.587,4.088,2.587,4.088,0,0-2.558-4.088-2.668-4.088,0" fill="#69a1ac" fillRule="evenodd" />
                <path d="M28.117,85.687c0,2.608,4.121,2.608,4.121,0,0-2.578-4.121-2.689-4.121,0" fill="#69a1ac" fillRule="evenodd" />
                <path d="M23.39,91.589c-2.661,2.657,6.687,7.314,8.891,3.618,1.811-3.035-2.132-2.029-3.529-2.193-1.519-.179-4.122-2.661-5.362-1.425" fill="#69a1ac" fillRule="evenodd" />
                <path
                  d="M98.124,85.74h0m-35.1-4.325c-2.694.505-11.536,3.488-11.655,6.685-.218,5.81,8.441-.141,10.322-.905,5.108-2.076,7.792,2.159,12.923,2.382,4.457.194,8.554-3.62,12.753-3.169,4.4.472,6.514,5.152,11.592,2.667,2.686-1.314,2.619-3.34-.4-3.531-1.823-.115-3.075.638-4.975-.146-2.972-1.226-4.169-3.222-7.725-2.9-2.684.239-5.109,1.752-7.729,2.337-6,1.34-9.325-4.5-15.108-3.415"
                  fill="#69a1ac"
                  fillRule="evenodd"
                />
                <path
                  d="M118.818,88.263h0m.68-2.419c.03.013.233.295,0,0M116.409,84h0m.067-.023c.6.358,5.414,3.651,1.917,4.426-1.775.394-3.244-3.179-1.917-4.426m-1.594-3.648c-7.713,3.517.587,16.1,6.64,10.989,2.547-2.152,2.882-6.5.4-8.742-1.485-1.343-5.029-3.167-7.045-2.246"
                  fill="#69a1ac"
                  fillRule="evenodd"
                />
                <path
                  d="M42.477,129.921c-9.625,0-19.334-.2-28.945.371-1.618.1-7.78-.212-8.613,1.479-1.525,3.093,4.816,1.557,5.737,1.465,19.138-1.916,39.129-.814,58.33-.267,15.7.446,31.323.724,47.008,1.533q6.184.319,12.362.7c1.343.081,4.722.971,5.005-1.174.262-1.985-3.954-1.537-5.007-1.592q-12.562-.661-25.116-1.374c-20.152-1.136-40.576-1.141-60.761-1.137"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path
                  d="M4.609,133.36c-1.8,1.787-.955,8.611-1.005,10.866-.088,3.945-.274,7.886-.357,11.83-.087,4.122.034,8.263.278,12.378.1,1.728,1.521,10.08,3.754,5.3,1-2.136-.024-8.085-.009-10.505.027-4.4.265-8.791.484-13.189.188-3.781.2-7.566.361-11.348.052-1.206.195-9.044-3.5-5.333"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path
                  d="M134.98,168.6c-9.367.96-18.883.506-28.286,1.215-8.1.611-16.2.861-24.323,1.033-18.4.388-36.824.767-55.167,2.3-4.18.349-8.356.72-12.547.907-2.1.094-10.893-.86-11.548,1.349-1.116,3.764,8.291,2.274,10.32,2.215,4.462-.129,8.9-.451,13.352-.79,18.7-1.425,37.478-1.851,56.221-2.443,10.194-.322,20.317-1.068,30.488-1.746,5.07-.338,10.153-.349,15.222-.677,1.326-.086,6.021.083,6.975-.984.656-.733.821-2.522-.708-2.379"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path
                  d="M131.8,134c.321,8.983.829,17.957,1.132,26.94.091,2.7-.725,7.542.78,9.924,2.418,3.83,4.306-.223,4.749-2.61,1.4-7.533-.1-15.855-.5-23.434-.149-2.892.749-9.327-.648-11.915-1.331-2.465-5.636-2.218-5.517,1.1"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path
                  d="M116.079,146.793c3.588.972,4.113,8.774.064,9.351-6.027.859-3.391-7.743-.064-9.351m-1.005-3.1c-1.095-.034-3.621-.336-4.3.555-.565.746.006,2.319-.06,3.029-.237,2.538-2.3,4-1.378,7a7.321,7.321,0,0,0,4.347,4.652c10.785,3.728,10.654-17.111,1.387-15.236"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path
                  d="M17.7,145.091l-.08.1.08-.1m8.471-4.507-.127-1.083c5.848,2.76,10.5,7.9,8.559,14.787-1.482,5.258-6.834,7.123-11.821,5.825-5.52-1.437-8.158-5.988-6.67-11.575.687-2.578,2.8-6.042,5.521-6.871,1.269-.386,4.075.6,4.537-1.083M22.753,138.4a8.344,8.344,0,0,0-4.126,1.559,6.738,6.738,0,0,1,4.126-1.559m.042-3.4c-3.654.112-6.048,2.324-8.216,4.98-.68.834-2.98,3.045-2.7,4.168.225.888.814,2.187,2.055,1.2-6.5,12.95,10.288,24,20.535,14.99,9.563-8.4.075-25.729-11.68-25.335"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
                <path d="M19.476,147.035a1.339,1.339,0,0,0,2.677,0,1.339,1.339,0,0,0-2.677,0" fill="#ddc8e1" fillRule="evenodd" />
                <path d="M24.044,147.329a1.361,1.361,0,0,0,2.72,0,1.361,1.361,0,0,0-2.72,0" fill="#ddc8e1" fillRule="evenodd" />
                <path d="M26.117,153.484c-1.273.1-5.931-.329-6.748.786-1.366,1.863.814,1.927,1.885,2.129.965.181,5.159.079,5.75-.778.522-.757.4-2.246-.887-2.136" fill="#ddc8e1" fillRule="evenodd" />
                <path
                  d="M82.241,148.653h0m-17.6-1.287c-2.867.211-5.3,1.86-8.038,2.518-2.926.7-4.193-.59-6.854-1.436a6.47,6.47,0,0,0-6.962,1.358c-1.261,1.071-4.026,3.537-3.238,5.44,1.8,4.355,5.888-2.731,7.809-3.06,3-.514,5.662,2.106,9.118,1.356,3.131-.679,5.909-2.829,9.18-2.852,2.735-.019,5.312,1.477,8.012,1.839,4.121.553,6.828-.91,10.638-2,3.3-.942,5.621.3,8.728,1.345,1.42.477,6.159,2.213,5.287-.934-.247-.889-6.492-2.479-7.46-2.785-3.414-1.079-5.577-.658-8.829.582a13.379,13.379,0,0,1-7.9.969c-3.2-.627-6.118-2.6-9.488-2.344"
                  fill="#ddc8e1"
                  fillRule="evenodd"
                />
              </g>
              <g transform="translate(358 414)" opacity="0.346">
                <path d="M.121-123.043C4.174-68.048,221.6,38.1,261.962-13.992s1.559-149.85-83.029-174.883S-3.931-178.038.121-123.043Z" transform="translate(278) rotate(180)" fill="#f2f2f2" fillRule="evenodd" />
                <path d="M244.079,158.351c3.4-46.641,185.885-136.662,219.762-92.485s25.3,137.1-45.692,158.329S240.678,204.992,244.079,158.351Z" fill="#dde3e9" fillRule="evenodd" />
              </g>
              <g transform="translate(381 314)">
                <g transform="translate(425) rotate(180)">
                  <g transform="translate(425 -0.798) rotate(-180)">
                    <g transform="translate(38.024 13.84) rotate(-8)">
                      <g transform="translate(38.515 22.058)">
                        <path
                          d="M27.205,6.5c4.133,7.685,3.642,27.18-1.7,28.554-2.13.548-6.668-.794-11.287-3.571l2.9,20.461H0l5.893-27.4C2.606,20.692.382,15.976.754,10.691,1.825-4.536,23.072-1.186,27.205,6.5Z"
                          fill="#b28b67"
                          fillRule="evenodd"
                        />
                      </g>
                      <path
                        d="M58.959,20.186A22.392,22.392,0,0,0,51.8,19.4a12.264,12.264,0,0,0,.872-6.213,18.9,18.9,0,0,0-2.02-5.617,7.682,7.682,0,0,0-1.494-2.323,5.107,5.107,0,0,0-2.418-1.3,6.484,6.484,0,0,0-2.785,0c-.4.085-.768.27-1.165.372s-.6-.149-.9-.4a5.1,5.1,0,0,0-2.654-1.027,6.859,6.859,0,0,0-3.02.361A5.913,5.913,0,0,0,33.7,4.858a4.207,4.207,0,0,0-.754,1.152c-.073.175-.085.279-.26.343s-.351.061-.518.118a6.517,6.517,0,0,0-3.75,3.391,10.728,10.728,0,0,0-.59,4.417c.057,1.841,1.724,6.646,3.282,8.4a10.478,10.478,0,0,0,5.41,3.048,15.43,15.43,0,0,0-2.827,5.259A25.684,25.684,0,0,0,32.4,37.374a20.8,20.8,0,0,0,.321,6.3,6.826,6.826,0,0,0,3.059,4.444,14.628,14.628,0,0,0,2.355,1.1A15.528,15.528,0,0,0,40.558,50a4.877,4.877,0,0,0,4.608-.983,8.634,8.634,0,0,0,1.239-1.57c.115-.2.184-.328.045-.522a3.738,3.738,0,0,0-.652-.592,6.127,6.127,0,0,1-2.173-4.06c-.194-1.667.255-3.818,1.879-4.545,2-.9,4.213.133,6,1.093a9.781,9.781,0,0,1,4.751-6.291c2.7-1.353,5.792-1.512,8.564-2.673a5.111,5.111,0,0,0,1.99-1.263,2.566,2.566,0,0,0,.572-.933,1.508,1.508,0,0,0-.4-1.172C65.793,24.636,61.3,20.9,58.959,20.186Z"
                        fill="#191847"
                        fillRule="evenodd"
                      />
                    </g>
                    <g transform="translate(0 137.187)">
                      <path d="M92.3,0l52.758,87.842,39.553,74.263h8.519L126.858,0Z" fill="#915b3c" fillRule="evenodd" />
                      <g transform="translate(177.5 140.715)">
                        <path
                          d="M1.66,18.4A13.363,13.363,0,0,0,.7,22.474,34.889,34.889,0,0,0,1.34,28H41.1q1.55-5.088-1.789-5.493t-5.548-.733l-18.206-8.06a1,1,0,0,0-1.319.51l-.009.021-1.072,2.582h0a12.746,12.746,0,0,1-5.024,1.432,10.389,10.389,0,0,1-3.8-1.023h0A2,2,0,0,0,1.7,18.287Q1.681,18.344,1.66,18.4Z"
                          fill="#e4e4e4"
                          fillRule="evenodd"
                        />
                      </g>
                      <path d="M173.626,150.214l16.429-4.95q-10.8-32.147-26.467-70.753T129.93,0h-46.4a725.656,725.656,0,0,0,42.4,82.538A558.652,558.652,0,0,0,173.626,150.214Z" fill="#571563" fillRule="evenodd" />
                      <path d="M88.833,0C83.853,30.868,74.25,70.306,73.343,71.524Q72.437,72.741,8.087,93.3l1.84,7.482Q86.665,89.756,90.8,83.673C94.926,77.59,115.551,29.531,123.54,0Z" fill="#915b3c" fillRule="evenodd" />
                      <path d="M23.167,86.834l3.241,12.05q57.4,5.013,70.335-7.245T126.237,0H81.989Q71.5,65,70.262,67.731T23.167,86.834Z" fill="#7a1b8b" fillRule="evenodd" />
                      <g transform="translate(27.562 85.114) rotate(80)">
                        <path
                          d="M1.66,18.4A13.363,13.363,0,0,0,.7,22.474,34.889,34.889,0,0,0,1.34,28H41.1q1.55-5.088-1.789-5.493t-5.548-.733l-18.206-8.06a1,1,0,0,0-1.319.51l-.009.021-1.072,2.582h0a12.746,12.746,0,0,1-5.024,1.432,10.389,10.389,0,0,1-3.8-1.023h0A2,2,0,0,0,1.7,18.287Q1.681,18.344,1.66,18.4Z"
                          fill="#e4e4e4"
                          fillRule="evenodd"
                        />
                      </g>
                    </g>
                    <g transform="translate(3.93 77.259) rotate(-8)">
                      <path
                        d="M48.322,52.553l15.568.058q-25.606,57.212-26.7,59.911c-1.645,4.048,1.836,10.213,3.325,13.526-4.849,2.154-4.332-5.824-10.448-3-5.583,2.579-9.83,7.252-16.28,3.3-.793-.486-1.662-2.315.438-3.745,5.231-3.561,12.769-9.794,13.787-11.846q2.083-4.2,20.313-58.206ZM180.36,39.046c-3.145,2.6-6.336,5.483-5.776,6.873s3.485.872,3.97,3.009q.485,2.137-14.241.694l-22.776,8.966L136.5,46.1l28.07-3.8a61.441,61.441,0,0,1,15.5-6.3C181.394,35.964,183.505,36.443,180.36,39.046Z"
                        fill="#997659"
                        fillRule="evenodd"
                      />
                      <path
                        d="M87.805,6.848l12.213-.259c5.341,26.6,23.114,42.144,59.082,33.209l7.872,34.169c-33.7,7.356-64.784-3.578-74.12-39.729C90.434,24.88,88.317,15.106,87.805,6.848Z"
                        transform="translate(4.09 -10.945) rotate(5)"
                        fill="#cca8d2"
                        fillRule="evenodd"
                      />
                      <path d="M84.941,0l.009.011,18.468,4.2c0,31.184,9.892,51.207,15.131,74.068l.177.78H68.85c-.7,8.012-1.134,16.248-1.359,24.706H30.145Q42.839,36.7,83.731,0h1.21Z" fill="#c5cfd6" fillRule="evenodd" />
                      <path d="M76.719,34.066q-1.928,29.479,2.268,44.993H68.85a241.428,241.428,0,0,1,7.785-44.7Z" fill="rgba(0,0,0,0.1)" fillRule="evenodd" />
                    </g>
                  </g>
                  <g transform="translate(73.688 -0.631) rotate(-7)">
                    <g transform="translate(38.515 -22.058)">
                      <path
                        d="M27.205-6.5c4.133-7.685,3.642-27.18-1.7-28.554-2.13-.548-6.668.794-11.287,3.571l2.9-20.461H0l5.893,27.4C2.606-20.693.382-15.976.754-10.691,1.825,4.536,23.072,1.186,27.205-6.5Z"
                        fill="#b28b67"
                        fillRule="evenodd"
                      />
                    </g>
                    <path
                      d="M55.963-19.7c-2.256.369-8.331.623-9.451.623-.716,0-1.492-.163-1.916.493-.347.537-.22,1.445-.324,2.068-.12.724-.291,1.439-.464,2.151a21.843,21.843,0,0,1-2.277,5.77A17.762,17.762,0,0,1,33.106-.984,27.117,27.117,0,0,1,20.313.771C15.722.4,11.566-1.112,7.231-2.535A27.48,27.48,0,0,0-5.548-3.762C-9.9-3.1-13.19-.741-16.862,1.493a21.115,21.115,0,0,1-12.5,3.439A24.1,24.1,0,0,1-40.761.619,18.57,18.57,0,0,1-48.113-7.7c-1.608-3.89-1.607-8.16,1.038-11.6,3.833-4.983,10.95-6.272,16.871-6.144a32.3,32.3,0,0,1,10.021,1.832c4.312,1.513,8.038,4.078,12.072,6.158a31.458,31.458,0,0,0,5.9,2.356c1.99.561,3.951.818,5.753-.382a27.184,27.184,0,0,1,5.8-3.31,18.731,18.731,0,0,1,6.537-1.171c4.337.033,8.612,1.382,12.824,2.284,3.435.736,7.11,1.47,10.612.762,1.461-.3,3.6-.905,4.123-2.42C34.552-20.939,31.063-31.9,33.568-39.944c1.352-4.342,9.476-9.419,12.635-7.136,2,1.446.786,3.345,0,4.6-1.506,2.4-2.021,5.484.765,7.155,2.4,1.441,4.93-1.981,4.978-1.978.661.052,6.368,3.272,10.3,7.972,3.88-.229,4.468,2.323,3.542,4.41S59.081-20.21,55.963-19.7Z"
                      fill="#191847"
                      fillRule="evenodd"
                    />
                  </g>
                  <g transform="translate(0 -137.985)">
                    <path
                      d="M147.082,6.97C133.562-4.06,138.9-101,138-102.223q-.6-.812-64.354-13.723l1.85-7.506q74.6,3.565,78.934,9.1,6.21,7.927,15.218,88.773Z"
                      transform="matrix(0.574, 0.819, -0.819, 0.574, 4.164, -124.48)"
                      fill="#b28b67"
                      fillRule="evenodd"
                    />
                    <path
                      d="M147.082,6.97C133.562-4.06,138.9-101,138-102.223q-.6-.812-64.354-13.723l1.85-7.506q74.6,3.565,78.934,9.1,6.21,7.927,15.218,88.773Z"
                      transform="matrix(0.574, 0.819, -0.819, 0.574, 4.164, -124.48)"
                      fill="rgba(0,0,0,0.1)"
                      fillRule="evenodd"
                    />
                    <path
                      d="M80.832-108.06l3.256-12.089c37.082-4.334,61.513.9,70.1,9.074q8.587,8.178,15.258,88.532L145.309,11.928c-32.188-24.291-12.822-104.05-13.642-105.872S111.3-97.172,80.832-108.06Z"
                      transform="matrix(0.574, 0.819, -0.819, 0.574, 8.398, -125.914)"
                      fill="#2f3676"
                      fillRule="evenodd"
                    />
                    <g transform="translate(143.09 -111.732) rotate(-20)">
                      <path
                        d="M1.66-18.4A13.363,13.363,0,0,1,.7-22.474,34.889,34.889,0,0,1,1.34-28H41.1q1.55,5.088-1.789,5.493t-5.548.733l-18.206,8.06a1,1,0,0,1-1.319-.51l-.009-.021-1.072-2.582h0a12.746,12.746,0,0,0-5.024-1.432,10.389,10.389,0,0,0-3.8,1.023h0A2,2,0,0,1,1.7-18.287Q1.681-18.344,1.66-18.4Z"
                        fill="#e4e4e4"
                        fillRule="evenodd"
                      />
                    </g>
                    <path d="M92.3,0,55.56-87.842,19.451-162.106H27.97L121.178,0Z" fill="#b28b67" fillRule="evenodd" />
                    <g transform="translate(17.04 -140.715)">
                      <path
                        d="M1.66-18.4A13.363,13.363,0,0,1,.7-22.474,34.889,34.889,0,0,1,1.34-28H41.1q1.55,5.088-1.789,5.493t-5.548.733l-18.206,8.06a1,1,0,0,1-1.319-.51l-.009-.021-1.072-2.582h0a12.746,12.746,0,0,0-5.024-1.432,10.389,10.389,0,0,0-3.8,1.023h0A2,2,0,0,1,1.7-18.287Q1.681-18.344,1.66-18.4Z"
                        fill="#e4e4e4"
                        fillRule="evenodd"
                      />
                    </g>
                    <path d="M22.712-146.678l18.93-3.536C56.279-128.783,117.534-40.908,124.25,0H82.107C59.679-29.572,36.664-124.893,22.712-146.678Z" fill="#5c63ab" fillRule="evenodd" />
                  </g>
                  <g transform="translate(24.357 -53.066) rotate(-7)">
                    <path
                      d="M36.619-57.883l14.568-2.87q-21.976-40.664-23.571-43.1c-2.392-3.66-.16-10.367.664-13.9-5.172-1.2-3.132,6.534-9.677,4.92-5.974-1.473-11.039-5.253-16.61-.155-.685.627-1.186,2.586,1.149,3.591,5.817,2.5,14.412,7.191,15.806,9.011Q21.8-96.667,36.619-57.883Zm144.093,21.7c-2.291-3.322-4.55-6.918-3.634-8.082s3.567.121,4.614-1.772q1.047-1.893-13.408-4.529L148.992-65.252l-8.226,10.463,25.761,11.233A60.987,60.987,0,0,0,179.6-33.376C180.856-32.978,183-32.858,180.713-36.18Z"
                      fill="#b28b67"
                      fillRule="evenodd"
                    />
                    <path
                      d="M87.667-6.995,93.7-5.416c14.463-11.68,22.607-42.07,31.854-45.378,8.743-3.127,20.33,1.653,34.05,7.939l5.179-9.242c-11.658-14.948-38.049-29.024-49.744-23.329C96.341-66.322,88.909-28.612,87.667-6.995Z"
                      transform="translate(4.06 10.845) rotate(-5)"
                      fill="#571563"
                      fillRule="evenodd"
                    />
                    <path d="M63.985-80.471h54.4c2.486,0,2.017,3.564,1.658,5.362C115.891-54.356,99.7-31.985,99.7-2.443L84.013,0C71.035-20.724,66.547-46.239,63.985-80.471Z" fill="#dde3e9" fillRule="evenodd" />
                    <path d="M85.833,0h3.38q21.128-71.51,11.649-95.294H51.9a176.356,176.356,0,0,0,6.662,35.84Q41.927-89.248,30.6-102.353l-11.4,2.217Q30.212-32.3,83,0Z" fill="#7a1b8b" fillRule="evenodd" />
                  </g>
                </g>
              </g>
            </g>
          </>
        );
        break;
      case 3:
        viewBox = "0 0 412.064 498.67";
        content = (
          <>
            <g transform="translate(-397.936 -271)">
              <g transform="translate(499 271)">
                <g transform="translate(86 90)">
                  <rect width="225" height="47" rx="4" fill="#fff" />
                  <g transform="translate(9 14.1)">
                    <rect width="167" height="7.05" rx="3" fill="#dde3e9" />
                    <rect width="112.096" height="7.05" rx="3" transform="translate(0 11.75)" fill="#dde3e9" />
                  </g>
                  <g transform="translate(193.954 16.5)">
                    <circle cx="7" cy="7" r="7" fill="#dde3e9" />
                    <circle cx="3" cy="3" r="3" transform="translate(4 4)" fill="#f2f2f2" />
                  </g>
                </g>
                <g transform="translate(225 46) rotate(180)">
                  <rect width="225" height="39" rx="4" transform="translate(0 -39)" fill="#fff" />
                  <g transform="translate(9 -11.7)">
                    <rect width="167" height="5.85" rx="2.925" transform="translate(0 -5.85)" fill="#dde3e9" />
                    <rect width="112.096" height="5.85" rx="2.925" transform="translate(0 -15.6)" fill="#dde3e9" />
                  </g>
                  <g transform="translate(193.954 -12.5)">
                    <circle cx="7" cy="7" r="7" transform="translate(0 -14)" fill="#dde3e9" />
                    <circle cx="3" cy="3" r="3" transform="translate(4 -10)" fill="#f2f2f2" />
                  </g>
                </g>
                <g transform="translate(86)">
                  <rect width="225" height="39" rx="4" fill="#fff" />
                  <g transform="translate(9 11.7)">
                    <rect width="167" height="5.85" rx="2.925" fill="#dde3e9" />
                    <rect width="112.096" height="5.85" rx="2.925" transform="translate(0 9.75)" fill="#dde3e9" />
                  </g>
                  <g transform="translate(193.954 12.5)">
                    <circle cx="7" cy="7" r="7" fill="#dde3e9" />
                    <circle cx="3" cy="3" r="3" transform="translate(4 4)" fill="#f2f2f2" />
                  </g>
                </g>
              </g>
              <g transform="translate(390 366)">
                <ellipse cx="99.89" cy="99.802" rx="99.89" ry="99.802" transform="translate(33.626 47.431)" fill="#cca8d2" />
                <g transform="translate(-15.824 -15.81)">
                  <g transform="translate(81.18)">
                    <g transform="translate(53.46 30.69)">
                      <path
                        d="M37.762,9.043C43.5,19.736,42.817,46.86,35.4,48.771c-2.957.762-9.256-1.105-15.668-4.97L23.76,72.27H0L8.179,34.144C3.617,28.79.53,22.228,1.046,14.875,2.533-6.311,32.025-1.651,37.762,9.043Z"
                        fill="#b28b67"
                        fillRule="evenodd"
                      />
                    </g>
                    <path
                      d="M59.814,69.6c-2.982-13.267-11.478-22.311-10.18-28.241a8.994,8.994,0,0,1,6.916-7.375q2.906-11.756,18.745-10C91.134,25.744,100.8,32.321,96.626,46.8c-3.838,0-8.47-1.388-14.877.99Q78.7,48.917,77.388,54.8H74.493q-4.215-6.987-8.311-5.135t-1.862,9L62.894,69.6Z"
                      fill="#191847"
                      fillRule="evenodd"
                    />
                  </g>
                  <g transform="translate(0 184.691)">
                    <path
                      d="M205.075-9.724c-18.849,15.378-11.4,150.547-12.655,152.246q-.838,1.133-89.722,19.127l2.58,10.466q104-4.963,110.051-12.683,8.657-11.052,21.208-123.775Z"
                      transform="matrix(0.574, -0.819, 0.819, 0.574, 5.817, 173.565)"
                      fill="#b28b67"
                      fillRule="evenodd"
                    />
                    <path
                      d="M205.075-9.724c-18.849,15.378-11.4,150.547-12.655,152.246q-.838,1.133-89.722,19.127l2.58,10.466q104-4.963,110.051-12.683,8.657-11.052,21.208-123.775Z"
                      transform="matrix(0.574, -0.819, 0.819, 0.574, 5.817, 173.565)"
                      fill="rgba(0,0,0,0.1)"
                      fillRule="evenodd"
                    />
                    <path
                      d="M112.72,150.654l4.54,16.857c51.7,6.047,85.763-1.243,97.734-12.645q11.971-11.4,21.265-123.438L202.6-16.638C157.729,17.228,184.739,128.437,183.6,130.978S155.2,135.476,112.72,150.654Z"
                      transform="matrix(0.574, -0.819, 0.819, 0.574, 11.72, 175.566)"
                      fill="#2f3676"
                      fillRule="evenodd"
                    />
                    <g transform="matrix(0.94, 0.342, -0.342, 0.94, 199.519, 155.769)">
                      <path
                        d="M2.648,24.528A20.278,20.278,0,0,0,.99,30.99a47.27,47.27,0,0,0,.892,7.62H57.72q2.177-7.016-2.513-7.575t-7.791-1.01L21.45,18.738a.99.99,0,0,0-1.3.513l0,.009L18.477,23.2h0a18.157,18.157,0,0,1-7.055,1.975A16.342,16.342,0,0,1,5.306,23.43h0a1.98,1.98,0,0,0-2.616,1Q2.667,24.477,2.648,24.528Z"
                        fill="#e4e4e4"
                        fillRule="evenodd"
                      />
                    </g>
                    <path d="M128.7,0,77.471,122.466,27.122,226H39L168.967,0Z" fill="#b28b67" fillRule="evenodd" />
                    <g transform="translate(23.76 196.179)">
                      <path
                        d="M2.648,24.528A20.278,20.278,0,0,0,.99,30.99a47.27,47.27,0,0,0,.892,7.62H57.72q2.177-7.016-2.513-7.575t-7.791-1.01L21.45,18.738a.99.99,0,0,0-1.3.513l0,.009L18.477,23.2h0a18.157,18.157,0,0,1-7.055,1.975A16.342,16.342,0,0,1,5.306,23.43h0a1.98,1.98,0,0,0-2.616,1Q2.667,24.477,2.648,24.528Z"
                        fill="#e4e4e4"
                        fillRule="evenodd"
                      />
                    </g>
                    <path d="M31.669,204.492l26.4,4.929C78.473,179.543,163.885,57.032,173.25,0H114.488C83.214,41.228,51.123,174.119,31.669,204.492Z" fill="#5c63ab" fillRule="evenodd" />
                  </g>
                  <g transform="translate(21.78 80.988)">
                    <path
                      d="M50.993,81.18,71.28,85.205q-30.6,57.032-32.823,60.454c-3.331,5.133-.223,14.54.925,19.494-7.2,1.676-4.362-9.164-13.476-6.9-8.319,2.066-15.373,7.368-23.13.217-.954-.879-1.652-3.627,1.6-5.036,8.1-3.511,20.069-10.086,22.01-12.638Q30.356,135.575,50.993,81.18ZM251.646,50.743c-3.19,4.659-6.335,9.7-5.061,11.336s4.967-.169,6.425,2.486q1.459,2.655-18.67,6.352l-26.866,20.6L196.02,76.841l35.872-15.754a85,85,0,0,1,18.2-14.278C251.846,46.252,254.836,46.084,251.646,50.743Z"
                      fill="#b28b67"
                      fillRule="evenodd"
                    />
                    <path
                      d="M122.047,9.778l8.4-2.209c20.151,16.393,31.519,59.02,44.4,63.667,12.178,4.394,28.31-2.3,47.412-11.1l7.22,12.965c-16.222,20.953-52.962,40.67-69.254,32.674C134.178,92.988,123.8,40.1,122.047,9.778Z"
                      transform="translate(5.687 -15.1) rotate(5)"
                      fill="#571563"
                      fillRule="evenodd"
                    />
                    <path d="M89.1,112.86h75.746c3.461,0,2.809-5,2.309-7.52C161.38,76.234,138.839,44.858,138.839,3.426L116.99,0C98.918,29.065,92.669,64.85,89.1,112.86Z" fill="#dde3e9" fillRule="evenodd" />
                    <path d="M119.524,0h4.707q29.422,100.292,16.222,133.65H72.27c1.079-16.272,4.538-33.481,9.275-50.26q-23.162,41.781-38.938,60.16L26.73,140.44Q42.071,45.3,115.581,0Z" fill="#7a1b8b" fillRule="evenodd" />
                  </g>
                </g>
              </g>
            </g>
          </>
        );
        break;
      case 4:
        viewBox = "0 0 543 350";
        content = (
          <>
            <g transform="translate(-328 -277)">
              <g transform="translate(328 280)" opacity="0.346">
                <path d="M.218-189.873C7.506-105.008,398.558,58.791,471.155-21.592s2.8-231.24-149.333-269.871S-7.07-274.738.218-189.873Z" transform="translate(500) rotate(180)" fill="#f2f2f2" fillRule="evenodd" />
                <path d="M166.125,255C171.49,195.106,459.341,79.51,512.779,136.238S552.692,312.285,440.7,339.547,160.76,314.887,166.125,255Z" fill="#dde3e9" fillRule="evenodd" />
              </g>
              <g transform="translate(556 277)">
                <path d="M48.007,51.986c0,.01-.008.02-.014.032.006-.01.014-.05.014-.032" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52a.087.087,0,0,0,0,.01c0-.01.018-.04,0-.01" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48.067,51.832c-.014.04-.032.078-.048.118.008-.02.016-.036.024-.056-.208.52-.076.182.024-.062" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48.022,51.953,48,52.009c-.058.112.024-.056.024-.056" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52h0v0Z" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52s0,0,0,0,0,0,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M47.99,52.016c-.012.024.056-.092,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52l0,0s0,0,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <rect width="95" height="63" rx="4" fill="#dde3e9" />
                <g transform="translate(8 18)">
                  <path d="M28,0,0,45H56Z" fill="#cca8d2" fillRule="evenodd" />
                  <path d="M55.5,12,31,45H80Z" fill="#c5cfd6" fillRule="evenodd" />
                </g>
                <circle cx="9" cy="9" r="9" transform="translate(65 12)" fill="#fff" />
              </g>
              <g transform="translate(688 277)">
                <path d="M48.007,51.986c0,.01-.008.02-.014.032.006-.01.014-.05.014-.032" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52a.087.087,0,0,0,0,.01c0-.01.018-.04,0-.01" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48.067,51.832c-.014.04-.032.078-.048.118.008-.02.016-.036.024-.056-.208.52-.076.182.024-.062" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48.022,51.953,48,52.009c-.058.112.024-.056.024-.056" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52h0v0Z" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52s0,0,0,0,0,0,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M47.99,52.016c-.012.024.056-.092,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52l0,0s0,0,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <rect width="95" height="63" rx="4" fill="#dde3e9" />
                <g transform="translate(8 18)">
                  <path d="M28,0,0,45H56Z" fill="#cca8d2" fillRule="evenodd" />
                  <path d="M55.5,12,31,45H80Z" fill="#c5cfd6" fillRule="evenodd" />
                </g>
                <circle cx="9" cy="9" r="9" transform="translate(65 12)" fill="#fff" />
              </g>
              <g transform="translate(688 374)">
                <path d="M48.007,51.986c0,.01-.008.02-.014.032.006-.01.014-.05.014-.032" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52a.087.087,0,0,0,0,.01c0-.01.018-.04,0-.01" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48.067,51.832c-.014.04-.032.078-.048.118.008-.02.016-.036.024-.056-.208.52-.076.182.024-.062" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48.022,51.953,48,52.009c-.058.112.024-.056.024-.056" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52h0v0Z" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52s0,0,0,0,0,0,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M47.99,52.016c-.012.024.056-.092,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52l0,0s0,0,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <rect width="95" height="63" rx="4" fill="#dde3e9" />
                <g transform="translate(8 18)">
                  <path d="M28,0,0,45H56Z" fill="#cca8d2" fillRule="evenodd" />
                  <path d="M55.5,12,31,45H80Z" fill="#c5cfd6" fillRule="evenodd" />
                </g>
                <circle cx="9" cy="9" r="9" transform="translate(65 12)" fill="#fff" />
              </g>
              <g transform="translate(556 374)">
                <path d="M48.007,51.986c0,.01-.008.02-.014.032.006-.01.014-.05.014-.032" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52a.087.087,0,0,0,0,.01c0-.01.018-.04,0-.01" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48.067,51.832c-.014.04-.032.078-.048.118.008-.02.016-.036.024-.056-.208.52-.076.182.024-.062" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48.022,51.953,48,52.009c-.058.112.024-.056.024-.056" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52h0v0Z" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52s0,0,0,0,0,0,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M47.99,52.016c-.012.024.056-.092,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <path d="M48,52l0,0s0,0,0,0" fill="#c5cfd6" fillRule="evenodd" />
                <rect width="95" height="63" rx="4" fill="#dde3e9" />
                <g transform="translate(8 18)">
                  <path d="M28,0,0,45H56Z" fill="#cca8d2" fillRule="evenodd" />
                  <path d="M55.5,12,31,45H80Z" fill="#c5cfd6" fillRule="evenodd" />
                </g>
                <circle cx="9" cy="9" r="9" transform="translate(65 12)" fill="#fff" />
              </g>
              <g transform="translate(347 262)">
                <g transform="translate(66)">
                  <g transform="translate(43.625 25.145)">
                    <path
                      d="M30.815,7.409C35.5,16.17,34.94,38.394,28.89,39.96c-2.413.624-7.553-.905-12.785-4.071l3.284,23.325H0L6.674,27.976C2.952,23.589.433,18.212.854,12.188,2.067-5.171,26.134-1.352,30.815,7.409Z"
                      fill="#b28b67"
                      fillRule="evenodd"
                    />
                  </g>
                  <path
                    d="M45.914,32.888C50.335,14.65,75.35,25.973,80.163,22.9c1.052,6.621-2.341,11.96-14.271,10.929-2.633,1.476-4.506,4.246-6.761,7.879a4.8,4.8,0,0,0-1.772-.336,4.871,4.871,0,0,0-3.387,8.348c-1.121,1.588-2.378,3.249-3.819,4.963-5.37-3.235-9.365-12.656-4.256-21.758Z"
                    fill="#191847"
                    fillRule="evenodd"
                  />
                </g>
                <g transform="translate(0 152)">
                  <path
                    d="M167.879-7.871c-15.458,12.606-9.49,123.24-10.521,124.632q-.688.928-73.526,15.746l2.1,8.564q85.212-4.167,90.174-10.492,7.1-9.056,17.5-101.336Z"
                    transform="matrix(0.574, -0.819, 0.819, 0.574, 4.598, 142.033)"
                    fill="#b28b67"
                    fillRule="evenodd"
                  />
                  <path
                    d="M167.879-7.871c-15.458,12.606-9.49,123.24-10.521,124.632q-.688.928-73.526,15.746l2.1,8.564q85.212-4.167,90.174-10.492,7.1-9.056,17.5-101.336Z"
                    transform="matrix(0.574, -0.819, 0.819, 0.574, 4.598, 142.033)"
                    fill="rgba(0,0,0,0.1)"
                    fillRule="evenodd"
                  />
                  <path
                    d="M92.028,123.5l3.7,13.793c42.352,4.9,70.264-1.1,80.083-10.448q9.819-9.345,17.545-101.06L165.835-13.524c-36.8,27.766-14.782,118.767-15.722,120.848S126.842,111.035,92.028,123.5Z"
                    transform="matrix(0.574, -0.819, 0.819, 0.574, 9.439, 143.65)"
                    fill="#2f3676"
                    fillRule="evenodd"
                  />
                  <g transform="matrix(0.94, 0.342, -0.342, 0.94, 163.189, 127.749)">
                    <path
                      d="M1.949,20.7A15.68,15.68,0,0,0,.8,25.511a39.684,39.684,0,0,0,.72,6.273H46.553q1.755-5.775-2.027-6.236t-6.284-.832l-20.7-9.185a1.043,1.043,0,0,0-1.376.53l-.01.024L14.9,19.1h0a14.414,14.414,0,0,1-5.69,1.626A12.059,12.059,0,0,1,4.745,19.5h0A2.086,2.086,0,0,0,2,20.572Q1.972,20.634,1.949,20.7Z"
                      fill="#e4e4e4"
                      fillRule="evenodd"
                    />
                  </g>
                  <path d="M105.256,0l-41.9,100.419-41.178,84.9H31.9L138.188,0Z" fill="#b28b67" fillRule="evenodd" />
                  <g transform="translate(19.432 160.861)">
                    <path
                      d="M1.949,20.7A15.68,15.68,0,0,0,.8,25.511a39.684,39.684,0,0,0,.72,6.273H46.553q1.755-5.775-2.027-6.236t-6.284-.832l-20.7-9.185a1.043,1.043,0,0,0-1.376.53l-.01.024L14.9,19.1h0a14.414,14.414,0,0,1-5.69,1.626A12.059,12.059,0,0,1,4.745,19.5h0A2.086,2.086,0,0,0,2,20.572Q1.972,20.634,1.949,20.7Z"
                      fill="#e4e4e4"
                      fillRule="evenodd"
                    />
                  </g>
                  <path d="M25.9,167.678l21.587,4.042C64.178,147.22,134.032,46.764,141.691,0H93.632C68.056,33.806,41.81,142.773,25.9,167.678Z" fill="#5c63ab" fillRule="evenodd" />
                </g>
                <g transform="translate(18 67)">
                  <path
                    d="M152.091,55.858l25.791,18.916a69.471,69.471,0,0,1,17.532,7.037c1.109,1.009,2.448,3.052-2.149,2.7l-.614-.046c-4.407-.319-8.864-.4-9.47,1.094-.634,1.566,2.148,3.44.866,5.553q-1.282,2.113-12.117-10.6L146.39,69.935Zm50.4-69.569c-3.049,3.455-6.1,7.226-5.231,8.675s4.043.357,4.961,2.651Q203.137-.089,186.452.9L162.624,14.91,154.8,1.89,185.446-7.3a69.441,69.441,0,0,1,16.178-9.75C203.1-17.326,205.538-17.165,202.489-13.71Z"
                    fill="#b28b67"
                    fillRule="evenodd"
                  />
                  <path
                    d="M102.684,12.647C123.02,34.277,147.827,48.389,181.662,60.9l-7.519,15.013c-34.913-3.278-53.577-5.9-68.2-27.565C102.269,42.913,95.708,24.2,91.777,14.484Z"
                    transform="matrix(0.966, 0.259, -0.259, 0.966, 16.119, -33.877)"
                    fill="#6c147c"
                    fillRule="evenodd"
                  />
                  <path d="M72.768,92.064h62.257Q113.872,27.626,113.414,3.611c-.016-.816-1.525-2.254-2.192-2.066Q103.9,3.611,95.546,0C80.787,23.709,75.683,52.9,72.768,92.064Z" fill="#f2f2f2" fillRule="evenodd" />
                  <path
                    d="M181.05-7.268l3.3,16.453C159.109,25.4,133.554,37.956,111.162,36.172c9.724,41.659,9.276,75.763-12.191,75.763h-33.2C60.5,76.545,74.36,27.477,87.206,2.727A4.379,4.379,0,0,1,91.2,0h9.646l.013.038C118.7.184,147.658,3.439,181.05-7.268Z"
                    fill="#7a1b8b"
                    fillRule="evenodd"
                  />
                </g>
              </g>
            </g>
          </>
        );
        break;
      default:
        console.log(`${icon} not found`);
    }

    return (
      <Svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        stroke-linecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        className={`icon-${icon} ${className}`}
        {...rest}
      >
        {content}
      </Svg>
    );
  })
);
