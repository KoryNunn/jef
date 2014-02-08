var deepEqual = require('deep-equal');

function sameAs(a,b){
    if(typeof a !== typeof b){
        return false;
    }
    if(a instanceof Date){
        return a.getTime() === b.getTime();
    }
    if(isNaN(a) && isNaN(b)){
        return true;
    }
    return deepEqual(a,b);
}

function addProperty(instance, name, eventName){
    var scope = instance.model,
        path = name,
        transform,
        changeHandler,
        property = function(value){
            if(!scope) {
                return;
            }

            var currentValue = scope.get(path);
            if(!arguments.length){
                return transform ? transform(currentValue) : currentValue;
            }

            if(!sameAs(value, currentValue)){
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

        model.on(path, callback);

        callback(property());
    };

    property.scopeTo = function(model, path){
        return (scope || model).scopeTo(path);
    };

    property.path = function(){
        return path;
    };

    instance[name] = property;
};

module.exports = addProperty;