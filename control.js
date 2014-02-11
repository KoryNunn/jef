var EventEmitter = require('events').EventEmitter,
    doc = require('doc-js');

function Control(model){
    var control = this,
        ready,
        inserted,
        insertCalled;

    this._boundEvents = [];
    this.setMaxListeners(100);

    this.model = model;

    this._render();

    this.element._control = this;

    var callInserted = function(){
            if(control._inserted){
                doc(document).off('DOMNodeInserted', insertedHandler);
            }
            insertCalled = true;
            control._inserted && control._inserted();
        },
        insertedHandler = function(event){
            if(doc(control.element).closest(event.target)){
                inserted = true;
                if(ready && !insertCalled){
                    callInserted();
                }
            }
        };

    if(control._inserted){
        doc(document).on('DOMNodeInserted', insertedHandler);
    }
    doc.ready(setTimeout.bind(null, function(){
        ready = true;
        if(inserted && !insertCalled){
            callInserted();
        }
        control._bind();
        control.emit('ready');
    },1));
}
Control.prototype = Object.create(EventEmitter.prototype);
Control.prototype.constructor = Control;
Control.prototype.bindTo = function(emitter, event, handler){
    this._boundEvents.push({
        emitter: emitter,
        event: event,
        handler: handler
    });

    emitter.on(event, handler);
};
Control.prototype.destroy = function(){
    this.emit('destroy');

    if(this.element && this.element.parentNode){
        this.element.parentNode.removeChild(this.element);
    }

    while(this._boundEvents.length) {
        var boundEvent = this._boundEvents.pop();

        boundEvent.emitter.removeListener(boundEvent.event, boundEvent.handler);
    }

    this.removeAllListeners();
    delete this.element;
};

module.exports = Control;