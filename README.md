# SSEQRCode

a qrcode component for Server-Sent Event.

## Installation

The package can be installed via NPM:

```bash
npm install sseqrcode --save
```

## Basic Concept

SSE: Using server-sent events on [MDN][Using server-sent events].

[Using server-sent events]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

```
                +-------+                  +---------+                         +---------+
                | user  |                  | browser |                         | server  |
                +-------+                  +---------+                         +---------+
                    |                           |                                   |
                    |                           | request login                     |
                    |                           |---------------------------------->|
                    |                ---------\ |                                   |
                    |                | onInit |-|                                   |
                    |                |--------| |                                   |
                    |                           |                                   |
                    |                           |        send('qrcode', base64/url) |
                    |                           |<----------------------------------|
                    |              -----------\ |                                   |
                    |              | onQrcode |-|                                   |
                    |              |----------| |                                   |
                    |                           |                                   |
                    |      present QRCode image |                                   |
                    |<--------------------------|                                   |
                    |                           |                                   |
                    |                           |        send('pending', 'pending') |
                    |                           |<----------------------------------|
                    |             ------------\ |                                   |
                    |             | onPending |-|                                   |
                    |             |-----------| |                                   |
------------------\ |                           |                                   |
| scan the QRCode |-|                           |                                   |
|-----------------| |                           |                                   |
                    |                           |                                   |
                    | access the login url      |                                   |
                    |-------------------------------------------------------------->|
                    |                           |                                   |
                    |                           |      send('scanned', 'logged in') |
                    |                           |<----------------------------------|
                    |             ------------\ |                                   |
                    |             | onScanned |-|                                   |
                    |             |-----------| |                                   |
                    |                           |                                   |
```

## Usage

```javascript
import React from 'react'
import { SSEQRCode } from 'SSEQRCode'

class App extends React.Component {
  handleScan = ret => {
    alert(`Logged in as #{ret}`)
  }

  render() {
    return (
      <div>
        <SSEQRCode
          sseURL='/api/sse'
          onScanned={this.handleScan} />
      </div>
    )
  }
}
```

## Props

**prop**|**type**|**required**|**description**
:-----:|:-----:|:-----:|:-----:
sseSource|EventSource|when sseURL is null|provided EventSource
sseURL|string|when sseSource is null|URL of the source
width|number or string| |width property on img tag, default 200
height|number or string| |height property on img tag, default 200
keepAlive|boolean| |whether to close connection after qrcodeEvent was received, default false
errorEvent|string| |name of error event, default 'error'
pendingEvent|string| |name of pending event, default 'pending'
scannedEvent|string| |name of scanned event, default 'scanned'
qrcodeEvent|string| |name of qrcode event, default 'qrcode'
onInit|Function| |will be called when EventSource is opened
[onQrcode](#onQrcode)|Function| |will be called when qrcodeEvent received
[onPending](#onPending)|Function| |will be called when pendingEvent received
[onScanned](#onScanned)|Function| |will be called when scannedEvent received
[onError](#onError)|Function| |will be called when errorEvent received or error occurred
[onQRCodeLoaded](#onQRCodeLoaded)|Function| |will be called when QRCode image is loaded

<a name="onQrcode"></a>
### onQrcode

`function onQrcode(data)`

where:
* `data` - *string* the received message from server, should be base64 or URL of QRCode image

<a name="onPending"></a>
### onPending

`function onPending(data)`

where:
* `data` - *string* the received message from server

<a name="onScanned"></a>
### onScanned

`function onScanned(data)`

where:
* `data` - *string* the received message from server, can be used for notification

<a name="onError"></a>
### onError

`function onError(data)`

where:
* `data` - *string* the received message from server or the error message

<a name="onQRCodeLoaded"></a>
### onQRCodeLoaded

`function onQRCodeLoaded()`

you can use this prop to control loading indicator.

For example,

```javascript
class Spin extends React.component {
  state = {
    loading: true,
  }

  handleLoaded = () => {
    this.setState({ loading: false })
  }

  render() {
    return (
      <div style={{ border: `1px solid ${this.state.loading ? 'grey' : 'red'}` }}>
        <SSEQRCode
          sseURL="/api/sse"
          onQRCodeLoaded={this.handleLoaded} />
      </div>
    )
  }
}
```