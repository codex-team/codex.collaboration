import { callbackType, NetworkService } from "./NetworkService";
/**
 * NetworkService with WebSocket
 */
export class WebSocketService extends NetworkService {

    /**
     * WebSocket instance
     */
    private socket: WebSocket;

    /**
     * messages buffer
     */
    private queue: object[];

    /**
     * message sending interval
     */
    private timeout: number = 50;

    /**
     * Open and set up WebService
     *
     * @constructor
     * @param {string} url -
     * @param {callbackType} callback
     */
    constructor(url: string, callback: callbackType) {
        super(url, callback);
        console.log(this.url);
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            setInterval(() => this._send(), this.timeout);
            this.listen();
        };
        this.socket.onerror = (e: Event) => {
            console.log(e);
        };
        this.queue = [];
    }

    /**
     * this.callback starts to listen messages from server
     */
    private listen() {
        if (!this.callback) {
            return;
        }
        this.socket.onmessage = this.callback;
    }

    /**
     * send message from queue to the server every {this.timeout} ms
     *
     * @callback
    */
    private _send() {
        const data = this.queue.shift();
        if (!data) {
            return;
        }
        this.socket.send(JSON.stringify(data));
    }

    /**
     * Push new message to the messages queue
     *
     * @param {Object} data - message to be sent on server
     */
    public send(data: object) {
        this.queue.push(data);
    }
}
