import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ChangePassword from './pages/ChangePassword';
import Login from './pages/Login';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import PasswordReset from './pages/PasswordReset';
import Register from './pages/Register';

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Main/>} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/password/reset' element={<PasswordReset />} />
                <Route path='/password/change' element={<ChangePassword />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
