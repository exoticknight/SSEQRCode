import React from 'react';

const defaultWidth = 200;
const defaultHeight = 200;

function safeInvoke(fun:Function | undefined, ...args:any[]) {
  if (typeof fun === 'function') {
    return fun.apply(null, args);
  }
  return fun;
}

export type EventSourceHandler = (msg:string) => void;

export interface SSEQRCodeProps {
  sseSource?:EventSource;
  sseURL?:string;

  width?:number | string;
  height?:number | string;
  keepAlive?:boolean;

  errorEvent?:string | 'error';
  pendingEvent?:string | 'pending';
  scannedEvent?:string | 'scanned';
  qrcodeEvent?:string | 'qrcode';

  onInit?:() => void;
  onQrcode?:EventSourceHandler;
  onPending?:EventSourceHandler;
  onScanned?:EventSourceHandler;
  onError?:EventSourceHandler;

  onQRCodeLoaded?:() => void;
}

export interface SSEQRcodeState {
  src:string | null;
}

export class SSEQRCode extends React.Component<SSEQRCodeProps, SSEQRcodeState> {
  eventHandlers:object;
  source:EventSource | null;

  state = {
    src: null,
  }

  constructor(props) {
    super(props);

    if (!this.props.sseSource && !this.props.sseURL) {
      throw `SSEQRCode: Either 'sseSource' or 'sseURL' should be given.`
    }

    this.eventHandlers = ['error', 'pending', 'scanned', 'qrcode'].reduce((o, name) => {
      o[this.props[`${name}Event`] || name] = this[`handle${name.charAt(0).toUpperCase()}${name.slice(1)}`];
      return o;
    }, {});
  }

  componentDidMount() {
    if (!this.props.sseSource && !this.props.sseURL) {
      throw 'lack of sse source or sse url';
    }

    this.source = this.props.sseSource || new EventSource(this.props.sseURL);
    this.bindEvent();
  }

  componentWillUnmount() {
    this.unbindEvent();
    // close EventSource if it was created by myself
    if (this.props.sseURL && this.source.close) {
      this.source.close();
      this.source = null;
    }
  }

  bindEvent = () => {
    if (this.props.sseURL) {
      this.source.onopen = () => {
        this.handleInit();
      };
      this.source.onerror = err => {
        this.handleError({ data:`${err}` });
      };
    }
    Object.entries(this.eventHandlers).forEach(([k, v]) => {
      this.source.addEventListener(k, v);
    });
  }

  unbindEvent = () => {
    Object.entries(this.eventHandlers).forEach(([k, v]) => {
      this.source.removeEventListener(k, v);
    });
  }

  handleInit = () => {
    safeInvoke(this.props.onInit);
  }

  handleQrcode = ({ data:qrcode }) => {
    this.setState({
      src: qrcode,
    });
    safeInvoke(this.props.onQrcode, qrcode);
  }

  handlePending = ({ data:msg }) => {
    safeInvoke(this.props.onPending, msg);
  }

  handleScanned = ({ data:ret }) => {
    if (!this.props.keepAlive && this.props.sseURL && this.source.close) {
      this.source.close();
    }
    safeInvoke(this.props.onScanned, ret);
  }

  handleError = ({ data:err }) => {
    this.setState({
      src: null,
    });
    safeInvoke(this.props.onError, err);
  }

  handleImageLoad = () => {
    safeInvoke(this.props.onQRCodeLoaded);
  }

  render() {
    const {
      width,
      height,
    } = this.props;
    const {
      src,
    } = this.state;

    return (
      !!src
      ? <img width={width || defaultWidth} height={height || defaultHeight} src={src} onLoad={this.handleImageLoad}/>
      : null
    );
  }
}

export default SSEQRCode;
