import { gql, useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";

export interface User {
    id: string,
    nickname: string
}

function useUser(): User | null {
    const apolloClient = useApolloClient();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            const res = await apolloClient.query({
                query: gql`
                    query getUser {
                        currentUser {
                            id,
                            nickname
                        }
                    }
                `
            });

            setUser(res.data.currentUser);
        })();
    }, [apolloClient]);

    return user;
}

export default useUser;