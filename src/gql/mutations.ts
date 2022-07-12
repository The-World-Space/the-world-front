import { ApolloClient, FetchResult, gql } from '@apollo/client';
import { Register, RegisterVariables } from './__generated__/Register';

export function registerLocal(
    apolloClient: ApolloClient<any>,
    variables: RegisterVariables
): Promise<FetchResult<Register, Record<string, any>, Record<string, any>>> {

    return apolloClient.mutate<Register, RegisterVariables>({
        mutation: gql`
            mutation Register($user: LocalUserInput!) {
                registerLocal(user: $user) {
                    id
                }
            }
        `,
        variables: variables
    });    
}
