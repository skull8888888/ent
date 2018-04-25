# Nebula.DialogBehavior

`Nebula.DialogBehavior` is a Polymer behavior to support building custom dialog elements.

## Import

```html
<link rel="import" href="/bower_components/nebula-loader/nebula-dialog-behavior.html"> 
```

## Usage

Add the behavior to you own element. The behavior includes properties, events, and methods for opening, closing and canceling the dialog. The `result` property can be used to define a set of values that identify how the dialog was closed. You need to set this property to meet the needs of your dialog element.

```js
class MyDialog extends Nebula.DialogBehavior(Polymer.Element) {
  static get is() { return 'my-dialog' }
}
```

## Style

The behavior can be used with custom styles defined in `nebula-dialog-styles`. Import these styles into your custom dialog element to automatically style the element as a backdrop with animation.

```html
<style include="nebula-dialog-styles"></style>
```

## API Reference

### Properties

#### allowCancel : Boolean

Indicates if the dialog can be canceled.

#### opened : Boolean

Indicates if the dialog is open.

#### result : Object

A value indicating how the dialog was closed (undefined if cancelled).

### Methods

#### cancel()

Cancels the dialog, and sets the result to `undefined`.

#### close(result)

Closes the dialog and sets the result to the specified argument value.

#### show(props) : Promise

Displays the element. Any properties that are provided will be merged into the element.

A promise is returned that will resolve when the element has been closed. If the element has not been attached to the DOM, it will automatically attach to the `document.body`.

### Events

#### opened : CustomEvent

Event fired when the dialog opening animation is complete.

#### closed : CustomEvent

Event fired when the dialog closing animation is complete.

## Mixins

#### [Nebula.ElementMixin](https://www.webcomponents.org/element/arsnebula/nebula-element-mixin)