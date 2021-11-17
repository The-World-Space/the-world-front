import { useApolloClient, ApolloClient, gql } from "@apollo/client";
import { useAsync } from 'react-use';

interface World {
    id: string;
    name: string;
    tiles: Tile[];
    iframeFloors: IframeFloor[];
    iframeWalls: IframeWall[];
    iframeEffects: IframeEffect[];
    imageFloors: ImageFloor[];
    imageWalls: ImageWall[];
    imageEffects: ImageEffect[];
}

interface Tile {
    x: number;
    y: number;
    movableRight: boolean;
    movableBottom: boolean;
}

interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IframeGameObject {
    src: string;
}

interface ImageGameObject {
    src: string;
}

interface IframeFloor extends IframeGameObject {}
interface IframeWall extends IframeGameObject {}
interface IframeEffect extends IframeGameObject {}

interface ImageFloor extends ImageGameObject {}
interface ImageWall extends ImageGameObject {}
interface ImageEffect extends ImageGameObject{}


async function getMyWorlds(apolloClient: ApolloClient<any>) {
    const result = await apolloClient.query({
        query: gql`
        query MyWorlds {
            myWorlds {
                id,
                name
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