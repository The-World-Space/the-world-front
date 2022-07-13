import {
    useCallback,
    useEffect,
    useState,
    memo
} from 'react';
import { 
    Link,
    useNavigate
} from 'react-router-dom';
import styled from 'styled-components';
import { MEDIA_MAX_WIDTH } from '../../constants/css';

import useDebounce from '../../hooks/useDebounce';
import useWindowSize from '../../hooks/useWindowSize';
import MenuButton from '../atoms/MenuButton';
import { PaddingDiv } from '../atoms/styled';

const NavBarOuterDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 20px;
    height: 60px;
    width: 100%;
    background-color: ${props => props.theme.colors.secondary};
    box-sizing: border-box;

    position: relative;
    z-index: 1;
`;

const NavBarDiv = styled.div`
    display: flex;
    align-items: center;

    width: 500px;
    height: 100%;
    padding: 0px 20px;
`;

const NavBarLeftDiv = styled(NavBarDiv)`
    justify-content: flex-start;
`;

const NavBarRightDiv = styled(NavBarDiv)`
    justify-content: flex-end;
`;

const NavBarLogo = styled.img`
    width: 50px;
    height: 50px;
`;

const NavBarButton = styled.button`
    height: 100%;
    width: 100px;
    border: none;
    font-size: 15px;
    padding: 0px 10px;

    background-color: rgba(255, 255, 255, 0);
    color: ${props => props.theme.colors.backgroundInverse};

    &:hover {
        color: ${props => props.theme.colors.buttonHover};
        background-color: rgba(255, 255, 255, 0.1);
    }

    &:active {
        color: ${props => props.theme.colors.buttonActive};
        background-color: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: ${MEDIA_MAX_WIDTH}px) {
        height: 50px;
        width: 100%;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        padding: 0px 40px;
    }
`;

const UserInfoDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    
    @media (max-width: ${MEDIA_MAX_WIDTH}px) {
        height: 50px;
        width: 100%;
    }
`;

function LeftNavBarButtons(): JSX.Element {
    return (
        <>
            <NavBarButton>
                Button1
            </NavBarButton>
            <NavBarButton>
                Button2
            </NavBarButton>
            <NavBarButton>
                Button3
            </NavBarButton>
        </>
    );
}

function RightNavbarButtons(): JSX.Element {
    const navigate = useNavigate();

    const handleLoginClick = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    return (
        <>
            <UserInfoDiv>
                <NavBarButton onClick={handleLoginClick}>
                    Sign In
                </NavBarButton>
            </UserInfoDiv>
        </>
    );
}

function PcNavBar(): JSX.Element {
    return (
        <NavBarOuterDiv>
            <NavBarLeftDiv>
                <Link to={'/'}>
                    <NavBarLogo/>
                </Link>
                <LeftNavBarButtons/>
            </NavBarLeftDiv>
            <NavBarRightDiv>
                <RightNavbarButtons/>
            </NavBarRightDiv>
        </NavBarOuterDiv>
    );
}

interface MobileNavBarPanelDivProps {
    isOpen: boolean;
}

const MobileNavBarPanelDiv = styled.div<MobileNavBarPanelDivProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 60px;
    width: 100%;

    background-color: ${props => props.theme.colors.secondary};
    transition: 0.3s;
    transform: ${props => props.isOpen ? 'translateY(0%)' : 'translateY(-100%)'};
`;

function MobileNavBar(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return (
        <>
            <NavBarOuterDiv>
                <NavBarLeftDiv>
                    <NavBarLogo />
                </NavBarLeftDiv>
                <NavBarRightDiv>
                    <MenuButton isOpen={isOpen} onClick={handleClick}/>
                </NavBarRightDiv>
            </NavBarOuterDiv>
            <MobileNavBarPanelDiv isOpen={isOpen}>
                <LeftNavBarButtons/>
                <PaddingDiv height='30px'/>
                <RightNavbarButtons/>
            </MobileNavBarPanelDiv>
        </>
    );
}

const PcNavBarMemo = memo(PcNavBar);
const MobileNavBarMemo = memo(MobileNavBar);

function NavBar(): JSX.Element {
    const [isMobile, setIsMobile] = useState(false);
    const [debouncedIsMobile, setDebouncedIsMobile] = useState(false);
    const windowSize = useWindowSize();

    useDebounce(() => {
        setDebouncedIsMobile(isMobile);
    }, 500, [isMobile, setDebouncedIsMobile]);

    useEffect(() => {
        setDebouncedIsMobile(window.innerWidth < MEDIA_MAX_WIDTH);
    }, []);

    useEffect(() => {
        setIsMobile(windowSize.width < MEDIA_MAX_WIDTH);
    }, [windowSize.width]);

    return (
        <>
            {!debouncedIsMobile ? <PcNavBarMemo /> : <MobileNavBarMemo />}
        </>
    );
}

export default NavBar;
