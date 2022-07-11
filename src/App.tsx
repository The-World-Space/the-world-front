import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import NotFound from './pages/NotFound';

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
