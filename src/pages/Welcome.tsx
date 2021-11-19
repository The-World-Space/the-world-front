import styled from "styled-components";
import twLogo1 from '../components/atoms/tw logo 1.svg';
import NavTemplate from "../components/templates/NavTemplate";

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 85%;
    box-sizing: border-box;
    flex: 1;
`;

const ContentDetailDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
`;

function Welcome() {
    return (
        <NavTemplate showNavContent={true}>
            <ContentDiv>
                <div>
                    <img src={twLogo1} alt={'logo img'} />
                </div>
                <ContentDetailDiv style={{
                    marginTop: `86px`,
                }}>
                    <div style={{ textAlign: 'right' }}>
                        사용자 지정 기능 확장이 가능한 2D 메타버스 서비스입니다.<br/> 탑다운 뷰로, 사용자는 원하는 사용자 지정 서비스를 바닥이나 건물로서 배치할 수 있습니다.<br/> 사용자 지정 서비스를 만드는 경우, 바닥이나 건물과의 상호작용을 원하는 대로 처리할 수 있습니다.
                    </div>
                    <div style={{
                        borderLeft: '1px solid #000000C0',
                        height: '110px',
                        margin: '0% 2% 0% 2%',
                    }}/>
                    <img src={`${process.env.PUBLIC_URL}/assets/welcome_img.png`} 
                    style={{
                        height: '300px',
                        margin: '0% 2% 0% 2%',
                        borderRadius: '35px',
                    }}/>
                </ContentDetailDiv>
            </ContentDiv>
        </NavTemplate>
    );
}

export default Welcome;
