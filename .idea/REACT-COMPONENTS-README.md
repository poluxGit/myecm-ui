# MyDocs Project

[React.js Component Documentation](https://facebook.github.io/react/docs/react-component.html)

[Methods references](https://facebook.github.io/react/docs/react-component.html#reference)

## React Component - Technical Information

### [LifeCycle](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle)

**Mounting**

```
These methods are called when an instance of a component is being created and inserted into the DOM:
```
  - constructor()
  - componentWillMount()
  - render()
  - componentDidMount()

**Updating**

```
An update can be caused by changes to props or state. These methods are called when a component is being re-rendered:
```
  - componentWillReceiveProps()
  - shouldComponentUpdate()
  - componentWillUpdate()
  - render()
  - componentDidUpdate()

**Unmounting**

```
This method is called when a component is being removed from the DOM:
```
  - componentWillUnmount()

### [Other APIs](https://facebook.github.io/react/docs/react-component.html#other-apis)
```
  Each component also provides some other APIs:
```
  - setState()
  - forceUpdate()

### [Class Properties](https://facebook.github.io/react/docs/react-component.html#class-properties)
  - defaultProps
  - displayName
  - propTypes
  
### [Instance Properties](https://facebook.github.io/react/docs/react-component.html#instance-properties)
  - props
  - state
