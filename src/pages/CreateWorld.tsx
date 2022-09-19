import { useApolloClient, ApolloClient, gql } from "@apollo/client";
import React, { useState } from "react";
import NavTemplate from "../components/templates/NavTemplate";
import {
    useHistory,
} from "react-router-dom";
import twLogo1 from "../components/atoms/tw logo 1.svg";
import styled from "styled-components";
import BlackInput from "../components/atoms/BlackInput";
import BlackSubmitButton from "../components/atoms/BlackSubmitButton";
import { FORM_FONT_FAMILY, FORM_FONT_STYLE, FORMTITLE_FONT_WEIGHT } from "../GlobalEnviroment";
import HorizontalDivider from "../components/atoms/HorizontalDivider";

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    flex: 1;
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
                name,
                isPublic: true,
            }
        }
    });
}

const CreateWorld: React.FC = () => {
    const [worldId, setWorldId] = useState("");
    const [worldName, setWorldName] = useState("");

    const apolloClient = useApolloClient();
    const history = useHistory();

    const submit = async () => {
        try {
            await createWorld(apolloClient, worldId, worldName);
            await apolloClient.resetStore();
            history.push("/");
        } catch(e) {
            alert(e);
        }
    };

    return (
        <NavTemplate>
            <ContentDiv>
                <div style={{
                    fontFamily: FORM_FONT_FAMILY,
                    fontStyle: FORM_FONT_STYLE,
                    fontWeight: FORMTITLE_FONT_WEIGHT,
                    fontSize: "32px",
                }}> Make World </div>
                <HorizontalDivider />
                <WorldImage src={twLogo1}  alt={"world img"} />
                <BlackInput type="text" placeholder="World ID" onChange={e => setWorldId(e.target.value)} value={worldId}/>
                <BlackInput type="text" placeholder="World Name" onChange={e => setWorldName(e.target.value)} value={worldName}/>
                <BlackSubmitButton type="button" onClick={submit}>
                    Create World
                </BlackSubmitButton>
            </ContentDiv>
        </NavTemplate>
    );
};

export default CreateWorld;
