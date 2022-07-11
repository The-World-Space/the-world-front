import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PasswordReset from './pages/PasswordReset';

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/password/reset' element={<PasswordReset />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
