import React from "react";
import { Route, Link, Router } from "wouter"; // Import wouter components and hooks

import Home from "./Home";
const App = () => {
  return (
    <Router>
     
      <Route path="/" component={Home} />
    
    </Router>
  );
};

export default App;
