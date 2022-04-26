import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate,
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
import TestGamePage from "./pages/TestGamePage";
import NetworkGamePage from "./pages/NetworkGamePage";
import UserInfo from "./pages/UserInfo";
import UploadHtml from "./pages/UploadHtml";
import { AuthContext } from "./context/contexts";
import { useContext } from "react";

function App(): JSX.Element {
    const { logged } = useContext(AuthContext);
    return (
        <Router>
            <Routes>
                {logged 
                    ? <Route path="/" element={<MyWorldList />} />
                    : <Route path="/" element={<Navigate to="/welcome" />} />
                }
                <Route path="/welcome" element={<Main />} />
                <Route path="/thelab/*" element={<Test />} />
                <Route path="/login/*" element={<Login />} />
                <Route path="/register/*" element={<Register />} />
                <Route path="/logout/*" element={<Logout />} />
                <Route path="/user/*" element={<UserInfo />} />
                <Route path="/createworld/*" element={<CreateWorld />} />
                <Route path="/mypage/*" element={<MyPage />} />
                <Route path="/game/*" element={<TestGamePage />} />
                <Route path="/world/:worldId" element={<NetworkGamePage />} />
                <Route path="/upload/*" element={<UploadHtml />} />
                <Route path="*" element={<Notfound />} />
            </Routes>
        </Router>
    );
}

export default App;
