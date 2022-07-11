import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
    useState,
    useEffect,
    useCallback
} from 'react';
import useDebounce from '../../hooks/useDebounce';
import MenuButton from '../atoms/MenuButton';

const NavBarOuterDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 20px;
    height: 60px;
    width: 100%;
    background-color: #272727;
    box-sizing: border-box;
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
    return (
        <>
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
                    <NavBarButton>
                        Sign In
                    </NavBarButton>
                </UserInfoDiv>
            </NavBarRightDiv>
        </>
    );
}

function MobileNavBar(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return (
        <>
            <NavBarLeftDiv>
                <NavBarLogo />
            </NavBarLeftDiv>
            <NavBarRightDiv>
                <MenuButton isOpen={isOpen} onClick={handleClick}/>
            </NavBarRightDiv>
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
        <NavBarOuterDiv>
            {!debouncedIsMobile ? <PcNavBar/> : <MobileNavBar/>}
        </NavBarOuterDiv>
    );
}

export default NavBar;
