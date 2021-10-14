function setStateOf<T>(object: T) {
    return (() => { }) as React.Dispatch<React.SetStateAction<T>>;
}

export interface User{
    isAuthorized: boolean | null,
    id: string | null,
    nickname: string | null,
}

export interface Todo{
    id: number,
    todo: string,
    checked: boolean,
}