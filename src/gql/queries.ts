import { ApolloClient, ApolloQueryResult, gql } from '@apollo/client';
import { LoginLocal, LoginLocalVariables } from './__generated__/LoginLocal';

export function loginLocal(
    apolloClient: ApolloClient<any>,
    variables: LoginLocalVariables
): Promise<ApolloQueryResult<LoginLocal>> {
    return apolloClient.query<LoginLocal, LoginLocalVariables>(
        {
            query: gql`
                query LoginLocal($email: String!, $password: String!) {
                    loginLocal(email: $email, password: $password)
                }
            `,
            variables: variables
        }
    );
}
