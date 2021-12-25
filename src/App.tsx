import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Main from "./pages/Welcome";
import Test from "./pages/Test";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Notfound from "./pages/Notfound";
import Register from "./pages/Register";
import CreateWorld from "./pages/CreateWorld";
import MyPage from "./pages/MyPage";
import MyWorldList from "./pages/MyWorldList";
import IngameInterface from "./components/organisms/IngameInterface";
import TestGamePage from "./pages/TestGamePage";
import NetworkGamePage from "./pages/NetworkGamePage";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MyWorldList} />
        <Route path="/welcome" exact component={Main} />
        <Route path="/thelab" component={Test} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/logout" component={Logout} />
        <Route path="/createworld" component={CreateWorld} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/interfacetest" component={IngameInterface} />
        <Route path="/game" component={TestGamePage} />
        <Route path="/world/:worldId" component={NetworkGamePage} />
        <Route path="*" component={Notfound} />
      </Switch>
    </Router>
  )
}

export default App;
