import TwitterApiv1ReadWrite from './client.v1.write';
/**
 * Twitter v1.1 API client with read/write/DMs rights.
 */
export declare class TwitterApiv1 extends TwitterApiv1ReadWrite {
    protected _prefix: string;
    /**
     * Get a client with read/write rights.
     */
    get readWrite(): TwitterApiv1ReadWrite;
}
export default TwitterApiv1;
