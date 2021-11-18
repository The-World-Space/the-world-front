import { useApolloClient, ApolloClient, gql } from "@apollo/client";
import { useAsync } from 'react-use';

interface World {
    id: string;
    name: string;
    tiles: Tile[];
    iframes: IframeGameObject[];
    images: ImageGameObject[];
}

enum GameObjectType {
    Floor,
    Wall,
    Effect,
}

interface Tile {
    x: number;
    y: number;
    movableRight: boolean;
    movableBottom: boolean;
}

interface GameObject {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}



interface IframeGameObject extends GameObject {
    src: string;
    type: GameObjectType;
}

interface ImageGameObject extends GameObject {
    src: string;
    type: GameObjectType;
}

async function getMyWorlds(apolloClient: ApolloClient<any>) {
    const result = await apolloClient.query({
        query: gql`
        query MyWorlds {
            myWorlds {
                id
                name
                tiles
                iframes
                images
            }
        }
        `
    });

    return result.data.myWorlds as World[];
}

const MyPage: React.FC = () => {
    const apolloClient = useApolloClient();
    const myWorlds = useAsync(() => getMyWorlds(apolloClient));

    return (
        <div>
            <h1>마이 페이지 입니다.</h1>
            {JSON.stringify(myWorlds.value ?? [])}
        </div>
    );
};

export default MyPage;