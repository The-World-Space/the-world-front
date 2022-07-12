import {
    createContext,
    useContext,
    useEffect,
    useCallback,
    useState
} from 'react';
import styled from 'styled-components';
import Portal from '../components/atoms/Portal';
import { MEDIA_MAX_WIDTH } from '../constants/css';

type ToastKind = 'success' | 'error' | 'warning' | 'info';

interface ToastKindProps {
    type: ToastKind;
    isFadeOut: boolean;
}

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

    transition: transform .6s ease-in-out;
    animation: ${props => props.isFadeOut ? 'fade-out' : 'slide-in'} .6s;
`;

interface ToastData extends ToastKindProps {
    message: string;
    timeoutId: number;
}

interface Toast {
    toasts: readonly ToastData[];
    showToast(message: string, type: ToastKind): void;
}

const ToastContext = createContext<Toast>({
    toasts: [],
    showToast: () => {/* */}
});

interface ToastProviderProps {
    children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((message: string, type: ToastKind) => {
        setToasts(toasts => [...toasts, { message, type, isFadeOut: false, timeoutId: 0 }]);
    }, [toasts, setToasts]);

    useEffect(() => {
        const timeoutIds: number[] = [];

        toasts.forEach(toast => {
            if (toast.timeoutId === 0) {
                toast.timeoutId = window.setTimeout(() => {
                    setToasts(toasts => toasts.filter(t => t.timeoutId !== toast.timeoutId));
                }, 3000);
            }
        });

        return () => {
            timeoutIds.forEach(timeoutId => window.clearTimeout(timeoutId));
        };
    }, [toasts, setToasts]);

    return (
        <ToastContext.Provider value={{ toasts, showToast }}>
            {children}
            <Portal elementId='modal-root'>
                {toasts.map((toast, index) => (
                    <ToastDiv type={toast.type} isFadeOut={toast.isFadeOut} key={index}>
                        {toast.message}
                    </ToastDiv>
                ))}
            </Portal>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}

export default useToast;
