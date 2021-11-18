import styled from "styled-components";
import twLogo1 from '../components/atoms/tw logo 1.svg';
import NavTemplate from "../components/templates/NavTemplate";


const Wrapper = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`

const HorizentalLine = styled.div`
    width: 100%;
    height: 2px;
    background-color: #00000060;

`

const MyworldText = styled.span`
    margin-top: 72px;
    margin-left: 147px;
    margin-bottom: 26px;

    font-size: 32px;
    font-weight: 500;
    font-family: Noto Sans;
`


const WorldListDiv = styled.div`
    width: 100%;
    height: 100%;
    
    display: flex;
    flex-direction: column;
    align-items: center;

    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;
`

const WorldItem = styled.div`
    width: 100%;
    height: 144px;
    max-width: 1140px;

    margin-top: 23px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: #D7CCC8;
    
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
    border-radius: 72px;
`

const WorldItemLeft = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`

const ThumbnailImage = styled.img`
    width: 144px;
    height: 144px;

    border-radius: 100%;

    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
`

const WorldItemInfo = styled.div`
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    margin-left: 20px;
`

const Title = styled.span`
    font-size: 20px;
    font-weight: 400;
    font-family: Noto Sans;
`
    
const SubTitle = styled.span`
    font-size: 16px;
    font-weight: 400;
    font-family: Noto Sans;
`

const WorldItemRight = styled.div`
    width: 144px;
    height: 144px;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const GreenCircle = styled.div`
    width: 56px;
    height: 56px;

    margin-top: 28px;
    margin-bottom: 6px;

    border-radius: 100%;

    background-color: #83CE8B;
`




function WorldList() {

    const list = [
        {
            id: "0",
            name: "world 1",
            thumbnail: twLogo1,
        },
        {
            id: "1",
            name: "world 2",
            thumbnail: twLogo1,
        },
        {
            id: "2",
            name: "world 3",
            thumbnail: twLogo1,
        },
        {
            id: "3",
            name: "world 4",
            thumbnail: twLogo1,
        },
        {
            id: "4",
            name: "world 5",
            thumbnail: twLogo1,
        },
    ]

    return (
        <NavTemplate showNavContent={true}>
            <Wrapper>
                <MyworldText>MY WORLDS</MyworldText>
                <HorizentalLine />
                <WorldListDiv>
                    {list.map(item => 
                        <WorldItem>
                            <WorldItemLeft>
                                <ThumbnailImage src={item.thumbnail} />
                                <WorldItemInfo>
                                    <Title>{item.name}</Title>
                                    <SubTitle>2021/11/17</SubTitle>
                                </WorldItemInfo>
                            </WorldItemLeft>
                            <WorldItemRight>
                                <GreenCircle />
                                <SubTitle>
                                    20/100
                                </SubTitle>
                            </WorldItemRight>
                        </WorldItem>
                    )}
                </WorldListDiv>
            </Wrapper>
        </NavTemplate>
    );
}

export default WorldList;
