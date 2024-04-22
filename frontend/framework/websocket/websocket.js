export default class WS extends WebSocket{
    constructor(url){
        super(url);
    }

    sendMessage(data){
        this.send(JSON.stringify(data));
    }

    onMessage(callback){
        this.addEventListener('message', function(event){
            callback(JSON.parse(event.data));
        });
    }

    onOpen(callback){
        this.addEventListener('open', function(event){
            callback();
        });
    }

    onClose(callback){
        this.addEventListener('close', function(event){
            callback();
        });
    }

}