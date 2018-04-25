# Nebula.ElementMixin

`Nebula.ElementMixin` is a Polymer Project [Class Expression Mixin](https://www.polymer-project.org/2.0/docs/devguide/custom-elements#mixins) that extends a custom element with a set of utility methods. 

## Usage

The mixin adds utility functions similar to those provided in Polymer v1 (that were removed in Polymer v2) including `listen` and `unlisten`, `fire`, and `debounce`. It also provides the ability to define property observers and computed properties imperatively using `observe` and `compute`.

The API utilizes [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), a new feature of ES2015 that enables new semantics for protected and private class members. Protected methods are defined using `Symbol.for` to add or retrieve them from the global registry, and private methods are defined using a local `Symbol`. To invoke any of the protected methods of the mixin, retrieve the global symbol, and invoke the computed function name.

## API Reference

### Methods

#### [compute](target, source, callback)

Adds a computed property binding imperatively. The callback context is automatically bound to the element. This is a specialized method to extend the standard Polymer capability. It utilizes a delegate pattern to allow a Polymer computed property to be bound to an inline function, or to a function with a computed name.

The `source` argument supports the same binding expression used with a standard computed property definition.

```js
const compute = Symbol.for('Nebula.ElementMixin.compute')
this[compute]('myProperty', 'prop1, prop2', callback) 
```

To trigger computed property handlers during initialization, add them to the constructor. To trigger computed property callbacks after element initialization, add them to the `ready` lifecycle callback.

#### [debounce](jobName, callback, delay)

Collapses multiple function calls into a single invocation with a specified delay timespan. The callback context is automatically bound to the element.

```js
const debounce = Symbol.for('Nebula.ElementMixin.debounce')
this[debounce]('myJob', calllback, 500)
```

#### [fire](eventType, detail, options)

Dispatches a `CustomEvent`.

```js
const fire = Symbol.for('Nebula.ElementMixin.fire')
this[fire]('my-event', {message: 'Hello World'}, {bubbles: true})
```

#### [listen](target, eventType, callback)

Adds an event listener to the target object. The callback context is automatically bound to the element. When the callback is invoked, `this` will be set to the element instance.

```js
const listen = Symbol.for('Nebula.ElementMixin.listen')
this[listen](this, 'tap', callback)
```

#### observe(source, calllback)

Adds a property observer imperatively. The callback function context is automatically bound to the element. This is a specialized method to extend the standard Polymer capability. It utilizes a delegate pattern to allow a Polymer property observer to be bound to an inline function, or to a function with a computed name.

The `source` argument supports the same binding expression used with a standard property observer definition.

```js
const observe = Symbol.for('Nebula.ElementMixin.observe')
this[observe]('myProp, myProp2.*, myProp3.splices', callback) 
```

To trigger observer callbacks during element initialization, add them to the constructor. To trigger observer callbacks after element initialization, add them to the `ready` lifecycle callback.

#### [unlisten](target, eventType)

Removes an event listener on the target object.

```js
const unlisten = Symbol.for('Nebula.ElementMixin.unlisten')
this[unlisten](this, 'tap')
```
