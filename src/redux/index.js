import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import { name as appName } from './app.json'; // Automatically imports the app name from app.json

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root); // Register the app with Redux
