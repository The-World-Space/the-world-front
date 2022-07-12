import styled from 'styled-components';
import Portal from '../atoms/Portal';
import {
    memo
} from 'react';
import { InnerFlexDiv1 } from '../atoms/styled';

const ModalContainerDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    z-index: 10;
    pointer-events: auto;
`;

const ModalInnerDiv = styled(InnerFlexDiv1)`
    background-color: ${props => props.theme.colors.background};
`;

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    title: string;
    children: React.ReactNode;
}

function Modal(props: ModalProps) {
    const { isOpen, onClose, title, children } = props;

    return (
        <Portal elementId='modal-root'>
            {isOpen && (
                <ModalContainerDiv>
                    <ModalInnerDiv>
                        <div>{title}</div>
                        <div>{children}</div>
                        <button onClick={onClose}>Close</button>
                    </ModalInnerDiv>
                </ModalContainerDiv>
            )}
        </Portal>
    );
}

export default memo(Modal);
