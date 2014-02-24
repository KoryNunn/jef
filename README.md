Jef
===


# Wat

Jef stands for 'Just enough framework', which is probably a shit name because it isn't really a framework at all, but i thought jef was a cool name.

Jef provides a simple helper for creating databound controls, that could potentially be used to create a rich application or component.

# Example

Jef exposes a small few things.

## jef.addProperty(instance, name);

addProperty simply adds a getter/setter on the instance of the control, that you can bind to, and get/set data from.

## jef.Control(model)

Control is an abstract constructor that does nothing useful without inheriting from it. It inherrits from nodes EventEmitter, and thus it has .on etc..

Control must be passed a model as it's first parameter when instantiated, and that model must be an [Ooze](https://github.com/KoryNunn/ooze) scope, or something else with the same API.

    var control = new jef.Control(model <[an ooze scope](https://github.com/KoryNunn/ooze)>);

Control only becomes usefull if you inherit from it (or override methods after instatiating).

Here is an example of how a textbox control can be created with jef:

    function Textbox(model){
        // Run the Control constructor against this.
        jef.Control.apply(this, arguments);

        // Add a value property that can be bound to.
        jef.addProperty(this, 'value');
    }
    Textbox.prototype = Object.create(jef.Control.prototype);
    Textbox.prototype.constructor = Textbox;

    // Add a render method, otherwise your control wouldn't have any UI bits.
    Textbox.prototype._render = function(){

        // Assign something to this.element.
        this.element = document.createElement('input');
    };

    // Add a bind method, this allows you to bind up all of the controls events in one location.
    Textbox.prototype._bind = function(){
        var control = this;

        // bind the controls value property to its input elements value.
        this.value.onChange(function(value){
            // Only set the value if the value passed in is truthy,
            // An easy safeguard against setting the inputs value to 'undefined'
            control.element.value = value ? value : '';
        });
    };

And that's it. Now when you create a new Textbox, you can insert it into the DOM however you like, and play with the value property on the model, and watch the input's value change.

    var model = new Ooze({value: 'hello world'});

    var textbox = new Textbox(model);

    document.body.appendChild(textbox.element);

