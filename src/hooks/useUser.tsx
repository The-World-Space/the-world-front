import {
    gql,
    useApolloClient
} from '@apollo/client';
import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

export interface User {
    email: string,
    username: string
}

interface UserState {
    user: User|null;
    setUser: (user: User|null) => void;
}

const UserContext = createContext<UserState>({
    user: null,
    setUser: () => {/* */}
});

interface UserProviderProps {
    children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): JSX.Element {
    const [user, setUser] = useState<User|null>(null);

    const client = useApolloClient();

    useEffect(() => {
        (() => {
            client.query({
                query: gql`
                    query getUser {
                        currentUser {
                            username
                        }
                    }
                `
            });
        });
    }, [client]);

    // useEffect(() => {
    //     setUser(data?.currentUser ?? null);
    // }, [data]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(): UserState {
    return useContext(UserContext);
}

export default useUser;
