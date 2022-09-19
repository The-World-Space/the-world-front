import { useContext } from "react";
import {
    HashRouter as Router,
    Redirect,
    Route,
    Switch} from "react-router-dom";

import { AuthContext } from "./context/contexts";
import CreateWorld from "./pages/CreateWorld";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import MyPage from "./pages/MyPage";
import MyWorldList from "./pages/MyWorldList";
import NetworkGamePage from "./pages/NetworkGamePage";
import Notfound from "./pages/Notfound";
import Register from "./pages/Register";
import Test from "./pages/Test";
import TestGamePage from "./pages/TestGamePage";
import UploadHtml from "./pages/UploadHtml";
import UserInfo from "./pages/UserInfo";
import Main from "./pages/Welcome";

function App(): JSX.Element {
    const { logged } = useContext(AuthContext);
    return (
        <Router>
            <Switch>
                {logged 
                    ? <Route exact path="/" component={MyWorldList} />
                    : <Redirect exact path="/" to="/welcome" />
                }
                <Route path="/welcome" exact component={Main} />
                <Route path="/thelab" component={Test} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/logout" component={Logout} />
                <Route path="/user" component={UserInfo} />
                <Route path="/createworld" component={CreateWorld} />
                <Route path="/mypage" component={MyPage} />
                <Route path="/game" component={TestGamePage} />
                <Route path="/world/:worldId" component={NetworkGamePage} />
                <Route path="/upload" component={UploadHtml} />
                <Route path="*" component={Notfound} />
            </Switch>
        </Router>
    );
}

export default App;
