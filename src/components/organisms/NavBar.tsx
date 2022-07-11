import {
    useCallback,
    useEffect,
    useState
} from 'react';
import { 
    Link,
    useNavigate
} from 'react-router-dom';
import styled from 'styled-components';

import useDebounce from '../../hooks/useDebounce';
import MenuButton from '../atoms/MenuButton';
import { PaddingDiv } from '../atoms/styled';

const NavBarOuterDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 20px;
    height: 60px;
    width: 100%;
    background-color: #272727;
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
    color: white;

    &:hover {
        color: #00bcd4;
        background-color: rgba(255, 255, 255, 0.1);
    }

    &:active {
        color: #00bcd4;
        background-color: rgba(255, 255, 255, 0.2);
    }
`;

const UserInfoDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
`;

function PcNavBar(): JSX.Element {
    const navigate = useNavigate();

    const handleLoginClick = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    return (
        <NavBarOuterDiv>
            <NavBarLeftDiv>
                <Link to={'/'}>
                    <NavBarLogo/>
                </Link>
                <NavBarButton>
                    Button1
                </NavBarButton>
                <NavBarButton>
                    Button2
                </NavBarButton>
                <NavBarButton>
                    Button3
                </NavBarButton>
            </NavBarLeftDiv>
            <NavBarRightDiv>
                <UserInfoDiv>
                    <NavBarButton onClick={handleLoginClick}>
                        Sign In
                    </NavBarButton>
                </UserInfoDiv>
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

    background-color: #272727;
    transition: 0.3s;
    transform: ${props => props.isOpen ? 'translateY(0%)' : 'translateY(-100%)'};
`;

const NavBarMobileButton = styled(NavBarButton)`
    height: 50px;
    width: 100%;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    padding: 0px 40px;
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
                <NavBarMobileButton>
                    Button1
                </NavBarMobileButton>
                <NavBarMobileButton>
                    Button2
                </NavBarMobileButton>
                <NavBarMobileButton>
                    Button3
                </NavBarMobileButton>
                <PaddingDiv height='30px'/>
                <NavBarMobileButton>
                    Sign In
                </NavBarMobileButton>
            </MobileNavBarPanelDiv>
        </>
    );
}

function NavBar(): JSX.Element {
    const [isMobile, setIsMobile] = useState(false);
    const [debouncedIsMobile, setDebouncedIsMobile] = useState(false);

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, [setIsMobile]);

    useDebounce(() => {
        setDebouncedIsMobile(isMobile);
    }, 500, [isMobile, setDebouncedIsMobile]);

    useEffect(() => {
        setDebouncedIsMobile(window.innerWidth < 768);
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    return (
        <>
            {!debouncedIsMobile ? <PcNavBar/> : <MobileNavBar/>}
        </>
    );
}

export default NavBar;
