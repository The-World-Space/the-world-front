import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Welcome from './pages/Welcome';
import NotFound from './pages/NotFound';

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/welcome' element={<Welcome />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
