/**
 * handler for messages from server
 */
export type callbackType = (data: MessageEvent) => void

/**
 * Abstract class for Network Services
 */
export abstract class NetworkService {
    /**
     * server address
     */
    protected url: string;

    /**
     * handler for messages from server
     */
    protected callback: callbackType;

    /**
     * @constructor
     * @param {string} url - server address
     * @param {callbackType} callback - handler for messages from server
     */
    protected constructor(url: string, callback: callbackType) {
        this.url = url;
        this.callback = callback;
    }

    /**
     * Send data to server
     *
     * @param {Object} data
     */
    abstract send(data: object)
}
