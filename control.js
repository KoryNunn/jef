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

    var insertedHandler = function(event){
        if(doc(control.element).closest(event.target)){
            doc(document).off('DOMNodeInserted', insertedHandler);
            inserted = true;
            if(ready && !insertCalled){
                insertCalled = true;
                control._inserted && control._inserted();
            }
        }
    };

    doc(document).on('DOMNodeInserted', insertedHandler);
    doc.ready(setTimeout.bind(null, function(){
        ready = true;
        if(inserted && !insertCalled){
            insertCalled = true;
            control._inserted && control._inserted();
        }
        control._bind();
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
};

module.exports = Control;