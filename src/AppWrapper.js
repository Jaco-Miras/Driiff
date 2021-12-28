import styled from "styled-components";

const AppWrapper = styled.div`
  min-height: 100%;
  .Toastify__toast {
    border-radius: 8px;
  }
  /* slide enter */
  .mobile-slide-enter,
  .mobile-slide-appear {
    opacity: 0;
    transform: scale(0.97) translateY(200px);
    z-index: 1;
  }
  .mobile-slide-enter.mobile-slide-enter-active,
  .mobile-slide-appear.mobile-slide-appear-active {
    opacity: 1;
    transform: scale(1) translateY(0);
    transition: opacity 300ms linear 100ms, transform 300ms ease-in-out 100ms;
  }

  /* slide exit */
  .mobile-slide-exit {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  .mobile-slide-exit.mobile-slide-exit-active {
    opacity: 0;
    transform: scale(0.97) translateY(5px);
    transition: opacity 150ms linear, transform 150ms ease-out;
  }
  .mobile-slide-exit-done {
    opacity: 0;
  }
  #meetingSDKElement .react-draggable {
    z-index: 1000;
  }
  .react-draggable {
    z-index: 1000;
  }

  .text-primary {
    color: ${(props) => props.theme.colors.primary}!important;
  }

  .channel-list .feather-eye,
  .channel-list .feather-eye-off,
  .fav-channel .feather-eye,
  .fav-channel .feather-eye-off,
  .chat-header-icon .feather-eye,
  .chat-header-icon .feather-eye-off {
    color: ${(props) => props.theme.colors.primary};
  }
  .custom-switch .custom-control-input:focus ~ .custom-control-label::before {
    box-shadow: 0 0 0 0.2rem ${({ theme }) => theme.colors.secondary};
  }
  .custom-switch .custom-control-input:checked ~ .custom-control-label::before {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .workspace-icon .badge.badge-pill.badge-primary {
    background: ${(props) => props.theme.colors.primary};
  }

  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.primary}!important;
    border-color: ${({ theme }) => theme.colors.primary}!important;
  }

  .btn.btn-outline-primary {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .btn.btn-primary:not(:disabled):not(.disabled):focus {
    box-shadow: 0 0 0 0.2rem #4e5d72 !important;
  }

  .btn.btn-secondary {
    background-color: ${({ theme }) => theme.colors.secondary}!important;
    border-color: ${({ theme }) => theme.colors.secondary}!important;
  }

  .badge.badge-pill {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  .app-block .app-sidebar .app-sidebar-menu .list-group .list-group-item.active {
    color: ${({ theme }) => theme.colors.secondary}!important;
    :after {
      background-color: ${({ theme }) => theme.colors.secondary}!important;
    }
  }

  .channel-list {
    :after {
      background-color: ${({ theme }) => theme.colors.secondary}!important;
    }
  }

  .form-control {
    :focus {
      border-color: ${(props) => props.theme.colors.primary} !important;
    }
  }

  .badge.badge-external {
    background-color: ${(props) => props.theme.colors.fourth};
  }

  .chat-date-icons {
    color: ${(props) => props.theme.colors.primary};
    .dark & {
      color: ${(props) => props.theme.colors.fifth};
    }
  }

  .feather.feather-send {
    background: ${(props) => props.theme.colors.primary}!important;
  }

  .active {
    :after {
      background: ${(props) => props.theme.colors.primary}!important;
    }
  }

  .post-item-panel,
  .post-comments {
    .badge.badge-secondary {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }

  .more-options:hover {
    color: ${(props) => props.theme.colors.primary} !important;
    border: 1px solid ${(props) => props.theme.colors.primary} !important;
    border-color: ${(props) => props.theme.colors.primary} !important;
  }

  .more-options svg:hover {
    color: ${(props) => props.theme.colors.primary};
  }
  .react-select__control,
  .react-select__control:hover,
  .react-select__control:active,
  .react-select__control:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__option--is-selected {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__option:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  .chat-right .quote-container {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  .post-item-panel svg.feather-pencil,
  .post-item-panel svg.feather-clock {
    color: ${(props) => props.theme.colors.primary};
  }
  .post-item-panel svg.feather-eye,
  .post-item-panel svg.feather-off {
    :hover {
      color: ${(props) => props.theme.colors.primary};
    }
  }
  .post-item-panel {
    .cci.cci-active + .ccl span:first-child {
      background: ${(props) => props.theme.colors.primary};
    }
  }
  .pagination .page-item.active .page-link {
    background-color: ${(props) => props.theme.colors.primary};
    color: #fff;
  }
  .page-link {
    color: ${(props) => props.theme.colors.primary};
  }
  .page-link:not(:disabled):not(.disabled):focus {
    box-shadow: 0 0 0 0.2rem ${(props) => props.theme.colors.secondary};
  }
  .chat-left .mention,
  .chat-left .mention a {
    color: ${(props) => props.theme.colors.primary};
    .dark & {
      color: #fff;
    }
  }
`;

export default AppWrapper;
