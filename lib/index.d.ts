/// <reference types="react" />
import * as React from 'react';
export declare type EventSourceHandler = (msg: string) => void;
export interface SSEQRCodeProps {
    sseSource?: EventSource;
    sseURL?: string;
    width?: number | string;
    height?: number | string;
    keepAlive?: boolean;
    errorEvent?: string | 'error';
    pendingEvent?: string | 'pending';
    scannedEvent?: string | 'scanned';
    qrcodeEvent?: string | 'qrcode';
    onInit?: () => void;
    onQrcode?: EventSourceHandler;
    onPending?: EventSourceHandler;
    onScanned?: EventSourceHandler;
    onError?: EventSourceHandler;
    onQRCodeLoaded?: () => void;
}
export interface SSEQRcodeState {
    src: string | null;
}
export declare class SSEQRCode extends React.Component<SSEQRCodeProps, SSEQRcodeState> {
    eventHandlers: object;
    source: EventSource | null;
    state: {
        src: any;
    };
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    bindEvent: () => void;
    unbindEvent: () => void;
    handleInit: () => void;
    handleQrcode: ({ data: qrcode }: {
        data: any;
    }) => void;
    handlePending: ({ data: msg }: {
        data: any;
    }) => void;
    handleScanned: ({ data: ret }: {
        data: any;
    }) => void;
    handleError: ({ data: err }: {
        data: any;
    }) => void;
    handleImageLoad: () => void;
    render(): JSX.Element;
}
export default SSEQRCode;
