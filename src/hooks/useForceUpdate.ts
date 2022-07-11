import {
    useState
} from 'react';

function useForceUpdate(): [number, () => void] {
    const [state, setState] = useState(0);
    return [
        state,
        () => setState(state + 1)
    ];
}

export default useForceUpdate;
