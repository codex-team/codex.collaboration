import { callbackType, NetworkService } from "./NetworkService";
/**
 * NetworkService with WebSocket
 */
export class WebSocketService extends NetworkService {

    private socket: WebSocket;
    private queue: object[]; // message buffer
    private timeout: number = 50; // message sending interval

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
            console.log('Opened');
            setInterval(() => this._send(), this.timeout);
            this.listen();
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
        console.log('listening for new messages...');
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
        console.log('Sent');
        this.socket.send(JSON.stringify(data));
    }

    /**
     * Push new message to messages queue
     *
     * @param {Object} data - message to be sent on server
     */
    public send(data: object) {
        this.queue.push(data);
    }
}
