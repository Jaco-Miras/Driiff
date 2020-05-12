import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import store from "./redux/store/configStore";

const wrapApp = reduxStore => (
  // <AppLayout>
      <Provider store={reduxStore}>
          <BrowserRouter>
              <App/>
          </BrowserRouter>
      </Provider>
  // </AppLayout>
);

ReactDOM.render(wrapApp(store), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
