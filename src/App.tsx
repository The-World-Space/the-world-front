import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import Main from './components/organisms/Main';
import Test from './pages/Test';
import Login from './components/organisms/Login';
import Logout from './pages/Logout';
import Notfound from './pages/Notfound';
import Register from './pages/Register';
import WorldPage from './pages/WorldPage';
import CreateWorld from './pages/CreateWorld';
import MyPage from './pages/MyPage';
import NavPage from './pages/NavPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <NavPage> <Main /> </NavPage>
        </Route>
        <Route path="/thelab" component={Test} />
        <Route path="/world/:worldId" component={WorldPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/logout" component={Logout} />
        <Route path="/createworld" component={CreateWorld} />
        <Route path="/mypage" component={MyPage} />
        <Route path="*" component={Notfound} />
      </Switch>
    </Router>
  )
}

export default App;
