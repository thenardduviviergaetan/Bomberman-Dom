export default class WS extends WebSocket{
    constructor(url){
        super(url);
    }

    sendMessage(data){
        this.send(JSON.stringify(data));
    }

    onMessage(callback){
        this.onmessage = function(event){
            callback(JSON.parse(event.data));
        }
    }

    onOpen(callback){
        this.onopen = callback;
    }

    onClose(callback){
        this.onclose = callback;
    }

}