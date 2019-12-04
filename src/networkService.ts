// тип для функций-обработчиков
type callbackType = (data: MessageEvent) => void

/**
 * Абстрактный класс для сервисов
 */
export abstract class NetworkService {
    protected url: string;
    protected callback: callbackType;

    /**
     * @constructor
     * @protected
     * @param {string} url - адрес сервера
     * @param {callbackType} callback - функция-обработчки сообщений с сервера
     */
    protected constructor(url: string, callback: callbackType) {
        this.url = url;
        this.callback = callback;
    }

    /**
     * Метод для отправки сообщений на сервер
     *
     * @abstract
     * @param data
     */
    abstract send(data: any)
}

/**
 * Реализация NetworkService для веб сокетов
 *
 * @extends NetworkService
 */
export class WebSocketService extends NetworkService {

    private socket: WebSocket;
    private queue: object[]; // буфер сообщений
    private timeout: number = 50; // интервал для отправки сообщений в мс

    /**
     * Открывает веб сокет
     *
     * @constructor
     * @param url
     * @param callback
     */
    constructor(url, callback: callbackType) {
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
     * Добавляет вызов callback для сообщений с сервера
     * @private
     */
    private listen() {
        if (!this.callback) {
            return;
        }
        this.socket.onmessage = this.callback;
        console.log('listening for new messages...');
    }

    /**
     * вызывается каждые timeout мс сообщение на сервер, если оно есть
     *
     * @private
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
     * @param data
     * @public
     */
    public send(data) {
        this.queue.push(data);
    }
}
