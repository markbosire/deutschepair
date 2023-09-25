import React from "react";
import { Route, Link, Router } from "wouter"; // Import wouter components and hooks

import Home from "./Home";
import WordList from "./components/wordList";
const App = () => {
  return (
    <Router>
     
      <Route path="/" component={Home} />
    
    </Router>
  );
};

export default App;
