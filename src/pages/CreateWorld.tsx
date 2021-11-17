import { useApolloClient, ApolloClient, gql } from "@apollo/client";
import { useState } from "react";

async function createWorld(apolloClient: ApolloClient<any>, id: string, name: string) {
    await apolloClient.mutate({
        mutation: gql`
        mutation CreateWorld($world: WorldInput!) {
            createWorld(world: $world) {
                id
            }
        }
        `,
        variables: {
            world: {
                id,
                name
            }
        }
    });
}



const CreateWorld: React.FC = () => {
    const [worldId, setWorldId] = useState('');
    const [worldName, setWorldName] = useState('');

    const apolloClient = useApolloClient();

    const submit = async () => {
        await createWorld(apolloClient, worldId, worldName);
    };

    return (
        <div>
            <h1>월드 만들기</h1>
            <input type="text" placeholder="World ID" onChange={e => setWorldId(e.target.value)} value={worldId}/>
            <input type="text" placeholder="World Name" onChange={e => setWorldName(e.target.value)} value={worldName}/>
            <input type="button" onClick={submit} value="만들기!"/>
        </div>
    )
};


export default CreateWorld;