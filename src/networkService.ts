type callbackType = (data: MessageEvent) => void

export abstract class NetworkService {
    protected url: string;
    protected callback: callbackType;

    protected constructor(url, callback: callbackType) {
        this.url = url;
        this.callback = callback;
    }

    abstract send(data: any)
}


export class WebSocketService extends NetworkService {
    private socket: WebSocket;
    private queue: object[];

    constructor(url, callback: callbackType) {
        super(url, callback);
        console.log(this.url);
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            console.log('Opened');
            setInterval(() => this._send(), 50);
            this.listen();
        };
        this.queue = [];
    }


    listen() {
        if (!this.callback) return;
        this.socket.onmessage = this.callback;
        console.log('listening for new messages...');
    }

    private _send() {
        const data = this.queue.shift();
        if (!data) return;
        console.log('Sent');
        this.socket.send(JSON.stringify(data));
    }

    send(data) {
        this.queue.push(data);
    }
}
