export default class WS extends WebSocket{
    constructor(url){
        super(url);
    }

    sendMessage(data){
        this.send(JSON.stringify(data));
    }

    onMessage(callback){
        this.addEventListener('message', function(event){
            try{
                callback(JSON.parse(event.data));
            } catch(err){
                return
            } //FIXME potential fix for the doubled message
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