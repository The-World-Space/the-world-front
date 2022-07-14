import { useAuthState } from "../contexts/AuthStateContext";


export function useCurrentUser() {
    const authState = useAuthState();
    return authState.user;
}