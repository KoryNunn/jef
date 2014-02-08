module.exports = function(instance, name, get, set){
    instance[name] = function(value){
        var currentValue = this.model.get(name);
        if(!arguments.length){
            return get.call(this);
        }

        if(value !== currentValue){
            set.call(this, value);
        }
    };
};