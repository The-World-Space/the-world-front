import {
    createContext,
    useContext,
    useCallback,
    useState,
    useRef
} from 'react';
import styled from 'styled-components';
import Portal from '../components/atoms/Portal';
import { MEDIA_MAX_WIDTH } from '../constants/css';
import useCounter from './useCounter';
import useWindowSize from './useWindowSize';

type ToastKind = 'success' | 'error' | 'warning' | 'info';

interface ToastKindProps {
    type: ToastKind;
    isFadeOut: boolean;
}

const ToastContainerDiv = styled.div`
    overflow: hidden;
    height: 100%;
`;

const ToastDiv = styled.div<ToastKindProps>`
    position: relative;
    top: 0;
    left: 0;
    width: 280px;

    margin: 10px 10px;
    padding: 20px 15px;
    
    @media (max-width: ${MEDIA_MAX_WIDTH}px) {
        width: calc(100% - 50px);
        margin: 10px auto;
    }
    
    z-index: 100;

    background-color: ${props => {
        switch (props.type) {
        case 'success':
            return props.theme.colors.success;
        case 'error':
            return props.theme.colors.error;
        case 'warning':
            return props.theme.colors.warning;
        case 'info':
            return props.theme.colors.info;
        }
    }};

    color: ${props => props.theme.colors.primaryInverse};

    @keyframes slide-in {
        from {
            left: -300px;
        }

        to {
            left: 0px;
        }
    }

    @keyframes fade-out {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    opacity: ${props => (props.isFadeOut ? 0 : 1)};

    transition: transform .5s ease-in-out;
    animation: ${props => props.isFadeOut ? 'fade-out' : 'slide-in'} .5s;
`;

interface ToastData extends ToastKindProps {
    id: number;
    message: string;
    timeoutIds: TimeoutIds;
}

interface TimeoutIds {
    fadeOutTimeoutId: number;
    removeTimeoutId: number;
}

interface Toast {
    showToast(message: string, type: ToastKind): void;
}

const ToastContext = createContext<Toast>({
    showToast: () => {/* */}
});

interface ToastProviderProps {
    children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const counter = useCounter();
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const toastDivContainerRef = useRef<HTMLDivElement | null>(null);

    const windowSize = useWindowSize();

    const showToast = useCallback((message: string, type: ToastKind) => {
        const id = counter.count;

        const toastDivContainerElement = toastDivContainerRef.current;
        if(!toastDivContainerElement) return;

        if(toastDivContainerElement.clientHeight > windowSize.height) {
            setToasts(toasts => {
                clearTimeout(toasts[0].timeoutIds.fadeOutTimeoutId);
                clearTimeout(toasts[0].timeoutIds.removeTimeoutId);

                return toasts.slice(1);
            });
        }
        setToasts(toasts => [...toasts, { id, message, type, isFadeOut: false, timeoutIds: {
            fadeOutTimeoutId: window.setTimeout(() => {
                setToasts(toasts => toasts.map(t => t.id === id ? { ...t, isFadeOut: true } : t));
            }, 2500),
            removeTimeoutId: window.setTimeout(() => {
                setToasts(toasts => toasts.filter(t => t.id !== id));
            }, 3000)
        }}]);
        counter.increment();
    }, [toasts, setToasts, counter.count, windowSize.height]);

    

    // useEffect(() => {
    //     return () => {
    //         console.log('??');
    //         toasts.forEach(toast => {
    //             window.clearTimeout(toast.timeoutIds.fadeOutTimeoutId);
    //             window.clearTimeout(toast.timeoutIds.removeTimeoutId);
    //         });
    //     };
    // }, [toasts, setToasts]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Portal elementId='modal-root'>
                <ToastContainerDiv ref={toastDivContainerRef}>
                    {toasts.map((toast/*, index*/) => (
                        <ToastDiv type={toast.type} isFadeOut={toast.isFadeOut} key={toast.id}>
                            {toast.message}
                        </ToastDiv>
                    ))}
                </ToastContainerDiv>
            </Portal>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}

export default useToast;
