import React from "react";

/**
 * localstorage에 저장되는 state 입니다.
 * 비용이 높아 보입니다. cache 사용 필요해보임
 * https://www.joshwcomeau.com/react/persisting-react-state-in-localstorage/
 * 
 * @param defaultValue useState와 같습니다.
 * @param key localstorage에 저장될때 쓰이는 key입니다. 절대 중복되지 않게 하세요.
 * @returns useState와 같습니다.
 */
export function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {

    const [value, setValue] = React.useState<T>(() => {
        const stickyValue = window.localStorage.getItem(key);
        return stickyValue !== null
            ? JSON.parse(stickyValue)
            : defaultValue;
    });

    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

/**
 * localstorage에 저장되는 state 입니다.
 * raw로 저장해 문자열만 가능합니다.
 * 
 * @param defaultValue useState와 같습니다.
 * @param key localstorage에 저장될때 쓰이는 key입니다. 절대 중복되지 않게 하세요.
 * @returns useState와 같습니다.
 */
export function useRawState(defaultValue: string, key: string): [string, React.Dispatch<React.SetStateAction<string>>] {

    const [value, setValue] = React.useState<string>(() => {
        const stickyValue = window.localStorage.getItem(key);
        return stickyValue !== null
            ? stickyValue
            : defaultValue;
    });

    React.useEffect(() => {
        window.localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
}