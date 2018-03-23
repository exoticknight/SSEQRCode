"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var defaultWidth = 200;
var defaultHeight = 200;
function safeInvoke(fun) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (typeof fun === 'function') {
        return fun.apply(null, args);
    }
    return fun;
}
var SSEQRCode = (function (_super) {
    __extends(SSEQRCode, _super);
    function SSEQRCode(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            src: null,
        };
        _this.bindEvent = function () {
            if (_this.props.sseURL) {
                _this.source.onopen = function () {
                    _this.handleInit();
                };
                _this.source.onerror = function (err) {
                    _this.handleError({ data: "" + err });
                };
            }
            Object.entries(_this.eventHandlers).forEach(function (_a) {
                var k = _a[0], v = _a[1];
                _this.source.addEventListener(k, v);
            });
        };
        _this.unbindEvent = function () {
            Object.entries(_this.eventHandlers).forEach(function (_a) {
                var k = _a[0], v = _a[1];
                _this.source.removeEventListener(k, v);
            });
        };
        _this.handleInit = function () {
            safeInvoke(_this.props.onInit);
        };
        _this.handleQrcode = function (_a) {
            var qrcode = _a.data;
            _this.setState({
                src: qrcode,
            });
            safeInvoke(_this.props.onQrcode, qrcode);
        };
        _this.handlePending = function (_a) {
            var msg = _a.data;
            safeInvoke(_this.props.onPending, msg);
        };
        _this.handleScanned = function (_a) {
            var ret = _a.data;
            if (!_this.props.keepAlive && _this.props.sseURL && _this.source.close) {
                _this.source.close();
            }
            safeInvoke(_this.props.onScanned, ret);
        };
        _this.handleError = function (_a) {
            var err = _a.data;
            _this.setState({
                src: null,
            });
            safeInvoke(_this.props.onError, err);
        };
        _this.handleImageLoad = function () {
            safeInvoke(_this.props.onQRCodeLoaded);
        };
        if (!_this.props.sseSource && !_this.props.sseURL) {
            throw "SSEQRCode: Either 'sseSource' or 'sseURL' should be given.";
        }
        _this.eventHandlers = ['error', 'pending', 'scanned', 'qrcode'].reduce(function (o, name) {
            o[_this.props[name + "Event"] || name] = _this["handle" + name.charAt(0).toUpperCase() + name.slice(1)];
            return o;
        }, {});
        return _this;
    }
    SSEQRCode.prototype.componentDidMount = function () {
        if (!this.props.sseSource && !this.props.sseURL) {
            throw 'lack of sse source or sse url';
        }
        this.source = this.props.sseSource || new EventSource(this.props.sseURL);
        this.bindEvent();
    };
    SSEQRCode.prototype.componentWillUnmount = function () {
        this.unbindEvent();
        if (this.props.sseURL && this.source.close) {
            this.source.close();
            this.source = null;
        }
    };
    SSEQRCode.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height;
        var src = this.state.src;
        return (!!src
            ? react_1.default.createElement("img", { width: width || defaultWidth, height: height || defaultHeight, src: src, onLoad: this.handleImageLoad })
            : null);
    };
    return SSEQRCode;
}(react_1.default.Component));
exports.SSEQRCode = SSEQRCode;
exports.default = SSEQRCode;
//# sourceMappingURL=index.js.map