import React from "react";
//Components
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
//Pages
import Home from "../../pages/home";
import Basic from "../../pages/basic";
import Expert from "../../pages/expert";
import Method from "../../pages/method";
import Moora from "../../pages/moora";
import Lineal from "../../pages/lineal";
import Topsis from "../../pages/topsis";

export default function MainRoutes() {
  return (
    <div>
      <Router>
        <Switch>
          <Redirect path="/" to="/home" exact />
          <Route path="/home" exact>
            <Home />
          </Route>
          <Route path="/home/method">
            <Method />
          </Route>
          <Route path="/home/basic">
            <Basic />
          </Route>
          <Route path="/home/expert">
            <Expert />
          </Route>
          <Route path="/home/moora">
            <Moora />
          </Route>
          <Route path="/home/topsis">
            <Topsis />
          </Route>
          <Route path="/home/lineal">
            <Lineal />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
