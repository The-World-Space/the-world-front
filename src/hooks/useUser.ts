import { gql, useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";

export interface User {
    id: string,
    nickname: string,
    skinSrc: string
}

function useUser(): User | null {
    const apolloClient = useApolloClient();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async (): Promise<void> => {
            const res = await apolloClient.query({
                query: gql`
                    query getUser {
                        currentUser {
                            id,
                            nickname,
                            skinSrc
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
