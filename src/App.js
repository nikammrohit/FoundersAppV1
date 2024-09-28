// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Geolocation from './components/Geolocation';
import Messaging from './components/Messaging';
import Events from './components/Events';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/profile" component={Profile} />
        <Route path="/geolocation" component={Geolocation} />
        <Route path="/messaging" component={Messaging} />
        <Route path="/events" component={Events} />
      </Switch>
    </Router>
  );
};

export default App;
