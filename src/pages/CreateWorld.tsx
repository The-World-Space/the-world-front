import { useApolloClient, ApolloClient, gql } from "@apollo/client";
import { useState } from "react";
import NavTemplate from "../components/templates/NavTemplate";
import {
    useHistory,
    Link
} from 'react-router-dom';
import styled from "styled-components";
import BlackInput from "../components/atoms/BlackInput";
import BlackSubmitButton from "../components/atoms/BlackSubmitButton";
import { FORM_FONT_FAMILY, FORM_FONT_STYLE, FORMTITLE_FONT_WEIGHT } from './GlobalEnviroment';
import HorizontalDivider from "../components/atoms/HorizontalDivider";

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
`;

const WorldImage = styled.img`
    height: 250px;
    margin: 4% 0% 4% 0%;
`;

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
        <NavTemplate>
            <ContentDiv>
                <div style={{
                    fontFamily: FORM_FONT_FAMILY,
                    fontStyle: FORM_FONT_STYLE,
                    fontWeight: FORMTITLE_FONT_WEIGHT,
                    fontSize: '32px',
                }}> Make World </div>
                <HorizontalDivider />
                <WorldImage src={`${process.env.PUBLIC_URL}/assets/takahiro.jpg`}  alt={'world img'} />
                <BlackInput type="text" placeholder="World ID" onChange={e => setWorldId(e.target.value)} value={worldId}/>
                <BlackInput type="text" placeholder="World Name" onChange={e => setWorldName(e.target.value)} value={worldName}/>
                <BlackSubmitButton type="button" onClick={submit}>
                    Create World
                </BlackSubmitButton>
            </ContentDiv>
        </NavTemplate>
    )
};


export default CreateWorld;