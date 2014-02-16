var deepEqual = require('deep-equal'),
    clone = require('clone');

function addProperty(instance, name, eventName){
    var scope = instance.model,
        path = name,
        transform,
        changeHandler,
        lastValue,
        property = function(value){
            if(!scope) {
                return;
            }

            var currentValue = scope.get(path);
            if(!arguments.length){
                return transform ? transform(currentValue) : currentValue;
            }

            var newValueJson = JSON.stringify(value);

            if(!deepEqual(value, lastValue)){
                lastValue = clone(value);
                scope.set(path, value);
                this.emit(eventName || name);
            }
        };

    property.bindTo = function(newScope, newPath, newTransform){
        if(typeof newScope !== 'object'){
            newPath = newScope;
            newTransform = newPath;
            newScope = scope;
        }

        transform = newTransform;

        scope = newScope;

        path = newPath;

        property.onChange(scope, changeHandler);
    };

    property.onChange = function(model, callback){
        if(typeof model === 'function'){
            callback = model;
            model = scope;
        }
        if(!callback || !model){
            return;
        }

        if(changeHandler){
            scope.off(path, changeHandler);
        }

        changeHandler = callback;

        scope.on(path, callback);

        callback(property());
    };

    property.scopeTo = function(model, path){
        return (scope || model).scopeTo(path);
    };

    property.path = function(){
        return path;
    };

    instance.on('destroy', function(){
        if(changeHandler){
            scope.off(path, changeHandler);
        }
    });

    instance[name] = property;
};

module.exports = addProperty;