// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import Phreddit from './components/phreddit.jsx'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PhredditProvider } from './components/phredditContext.js';

const App = () => {
  return (
    <PhredditProvider>  {/* Wrap your app in the PhredditProvider */}
      <div>
        <Phreddit />
      </div>
    </PhredditProvider>
  );
};

export default App;