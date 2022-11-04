## 什么是数据流？


提到数据流，要先提一下函数响应式编程（Functional Reactive Programming），顾名思义，函数响应式编程是一种利用函数式编程的部件进行响应式编程的编程范式。



数据流（Data Flow）则是其中响应式编程的重要概念，响应式编程将程序逻辑建模成为在运算（Operation）之间流动的数据及其变化。



举个最简单的例子，对于 b = a * 2 这个赋值语句，如果把 a * 2 定义为一个运算，那么如果流动进来的 a 发生了改变，则 b 会自动响应前者的变化。



估计你看到这个例子，马上就会想到 React 的设计哲学 UI = f(state) ，比如一个函数组件 ({ a }) => (
{ a * 2 }
) ，只要 prop 属性 a 发生变化，组件渲染的
包含的内容就会自动变化。


我们知道 React 的开发单元是组件，多个组件在运行时会形成一颗组件树，根组件会沿着子组件树传递数据。对于任意一条从根组件到叶子节点组件的路径，都可以看作是一条工厂流水线。而每个组件都是流水线上的一道工序，对流过的数据各取所需，完成本职工作。


## React 的数据流包含哪些数据？

React 的数据流主要包含了三种数据：属性 props、状态 state 和上下文 context。这三个概念在 React 中算是专有名词，为避免歧义，我在本课程中将沿用它们的英文名称。我们先来系统地看一下 props。



### Props


自定义 React 组件接受一组输入参数，用于改变组件运行时的行为，这组参数就是 props。在声明函数组件时，函数的第一个参数就是 props。以下两种写法都很常见：
一个是在组件内部读取 props 对象的属性；
另一个是通过 ES6 的解构赋值语法（Destructuring Assignment）展开函数参数，直接在组件内部读取单个 prop 变量。



``` js

// 1
function MyComponent(props) {
  return (
    <ul>
      <li>{props.prop1}</li>
      <li>{props.prop2}</li>
    </ul>
  );
}

// 2
function MyComponent({ prop1, prop2 }) {
  return (
    <ul>
      <li>{prop1}</li>
      <li>{prop2}</li>
    </ul>
  );
}
```


第二种写法有些很方便的功能，比如为 prop 设置默认值：


``` js

function MyComponent({ prop1, prop2, optionalProp = 'default' }) {
```



以及利用 ES2018 的 Rest Properties 语法，将解构剩余属性赋值给一个变量，便于透传给子元素：


``` js

function MyComponent({ prop1, prop2, ...restProps }) {
  return (
    <ul {...restProps}>
      <li>{prop1}</li>
      <li>{prop2}</li>
    </ul>
  );
}
```
顺带一提，类组件的 props 可以通过 this.props 读取：



``` js


class MyLegacyClassComponent extends React.Component {
  render() {
    return (
      <ul>
        <li>{this.props.prop1}</li>
        <li>{this.props.prop2}</li>
      </ul>
    );
  }
}

```


需要注意的是，无论是哪种写法，props 都是不可变的，不能在组件内改写从外面传进来的 props。上面了解了如何声明 props，再看看如何赋值。在其他组件中使用子组件时，可以通过 JSX 语法为子组件的 props 赋值：



``` js

const ParentComponent = () => (
  <MyComponent prop1="文本" prop2={123} booleanProp={false}
    onClick={(evt) => {console.log('clicked')}} />
);
```



当 prop 值为布尔值的 true 时，JSX 可以简写成 。此外还有一个特殊的 props：代表子元素的children。



请回忆一下你在第 5 节课拆分 oh-my-kanban 项目组件时，在 组件的 JSX 闭合标签中加入子元素 ，子元素会被赋值给该组件 props 里的 children 属性，在 组件的函数内部即可使用这个 props.children。 与 之间也是类似的。


key 和 ref 的特殊之处还在于，当子元素是自定义组件时，在子组件内部是不能读取传给它的 key 或 ref 值的，如果尝试读取，React 则会在控制台提示，也就是 Warning: KanbanCard: keyis not a prop. Trying to access it will result inundefined being returned；如果确实需要在子组件中访问 key 或 ref 的值，就得用另一个额外的 prop 传进来。


说回数据流，props 的数据流向是单向的，只能从父组件流向子组件，而不能从子组件流回父组件，也不能从当前组件流向平级组件。如下图所示：


### State

在 props 之外，组件也可以拥有自己的数据。对于一个函数而言，“自己的数据”一般是指函数内声明的变量。而对一个函数组件来说，因为每次渲染函数体都会重新执行，函数体内变量也会被重新声明，如果需要组件在它的生命周期期间拥有一个“稳定存在”的数据，那就需要为组件引入一个专有的概念，即 state。在函数组件中使用 state，需要调用 useState / useReducer Hooks。这两个 Hooks 在第 9 节课刚学习过，在此只放一段例子代码，不再赘述


``` js

function MyComponent() {
  const [state1, setState1] = useState('文本');
  const [state2, setState2] = useState(123);
  const handleClick = () => {
    setState1('更新文本');
    setState2(456);
  };
  return (
    <ul>
      <li>{state1}</li>
      <li>{state2}</li>
      <li><button onClick={handleClick}>更新state</button></li>
    </ul>
  );
}
```

不过需要反复强调的是，state 与 props 一样，也是不可变的。需要修改 state 时，不能直接给 state 变量赋值，而是必须调用 state 更新函数，即 setXxx / dispatch 或 this.setState 。当组件的 state 发生改变时，组件将重新渲染。那什么才算是改变呢？从底层实现来看，React 框架是用 Object.is() 来判断两个值是否不同的。尤其注意，当新旧值都是对象、数组、函数时，判断依据是它们的值引用是否不同。对同一个对象属性的修改不会改变对象的值引用，对同一个数组成员的修改也不会改变数组的值引用，在 React 中都不认为是变化。所以在更新这类 state 时，需要新建对象、数组：


``` js


function MyComponent() {
  const [obj, setObj] = useState({ a: '文本', b: true });
  const [arr, setArr] = useState([1, 2, 3]);
  const handleClick = () => {
    setObj({...obj, a: '更新文本'}); // ...对象展开语法
    setArr([...arr, 4, 5, 6]); // ...数组展开语法
  };
  return (
    <ul>
      <li>{obj.a}</li>
      <li>{arr.join(',')}</li>
      <li><button onClick={handleClick}>更新state</button></li>
    </ul>
  );
}
```


还有要注意的就是 state 更新的异步性和自动批处理。如果印象有些模糊了，那请你务必复习一下第 9 节课的内容。再来看看 state 的数据流向，当读取和更改 state 都发生在同一组件中时，state 的流动仅限于当前组件之内。

如果希望由子组件或后代组件来更改 state，需要将对应的 state 更新函数包在另一个函数，比如事件处理函数中，然后将函数以 props 或 context 的方式传给子组件或后代组件，由它们来决定调用的时机和参数。当这个函数被调用，state 被更新，当前组件则会重新传染。




## Context





“终于”，你也许会感叹，“终于讲到 context 了”。React 很早就引入了 context 这个概念，它的 API 也经历过新老版本的更迭，用于组件跨越多个组件层次结构，向后代组件传递和共享“全局”数据。


使用 context 分三个步骤：

1. 调用 React.createContext 方法创建 Context 对象，如 MyContext ：
    const MyContext = React.createContext('没路用的初始值');

2. 在组件 JSX 中使用 组件，定义 value 值，并将子组件声明在前者的闭合标签里：

``` js

function MyComponent() {
  const [state1, setState1] = useState('文本');
  const handleClick = () => {
    setState1('更新文本');
  };
  return (
    <MyContext.Provider value={state1}>
      <ul>
        <MyChildComponent />
        <li><button onClick={handleClick}>更新state</button></li>
      </ul>
    </MyContext.Provider>
  );
}
```

3. 在子组件或后代组件中使用 useContext Hook 获取 MyContext 的值，这个组件就成为 MyContext 的消费者（Consumer）：


``` js

function MyChildComponent() {
  return (
    <MyGrandchildComponent />
  );
}

function MyGrandchildComponent() {
  const value = useContext(MyContext);
  return (
    <li>{value}</li>
  );
}
```


其中MyContext.Provider 是可以嵌套使用的。MyGrandchildComponent 组件会去到组件树，从它的祖先节点中找到离它最近的 MyContext.Provider 即 MyComponent ，读取后者的 value 值；当 MyComponent 的 state1 ，也就是 MyContext.Provider 的 value 值发生更改时，会通知到它后代组件中所有消费者组件重新渲染。



从数据流的角度看，context 的数据流向也是单向的，只能从声明了 Context.Provider 的当前组件传递给它的子组件树，即子组件和后代组件。而不能向父组件或祖先组件传递，也不能向当前子组件树之外的其他分支组件树传递。正如下图所示：




至此，我们介绍完了 props、state 和 context 这三个概念。其中 props 和 state，我们已经在 oh-my-kanban 中做了丰富的实践，至于 context，我们下节课会利用它为看板加入管理员功能。接下来，仍然让我们将注意力集中在数据流上。




### React 单向数据流


刚才介绍的 props、state 和 context 三种数据，共同组成了 React 组件的数据流。早在第 5 节课我们就已经学习过，React 是一种声明式的前端框架，在 React 的数据流上也体现了这一点。在典型场景下，你可以通过声明这三种数据来设计 React 应用的数据流，进而控制应用的交互和逻辑。


只有这三种数据的变更会自动通知到 React 框架，触发组件必要的重新渲染。当你的数据流中混入了不属于它们其中任意一种的数据，就要小心，这种跳出“三界之外”的数据很有可能带来 Bug，比如数据改变了但组件并不重新渲染。


虽然说 props、state 和 context 是不同的概念，但从一棵组件树的多个组件来看，同一条数据在引用不变的前提下，在传递过程中却可以具有多重身份。


比如，一条数据最初来自于组件 A 的 state，通过 props 传递给子组件 B 后就成为了组件 B 的 prop。再比如，另一条数据来自于组件 A 的 state，通过在 A 中声明 context 传给了子组件树，子组件 B 的子组件 C 消费了这个 context 值。



### 基于数据流再做一次组件拆分

首先强调一点，大部分时候我们不应该为了重构而重构，除非我们很清楚重构的目标范围、预期收益、成本和存在的风险。


这次的重构当然在一定程度上是为了教学目的，不过我还是会列（xiā）举（biān）一些重构oh-my-kanban 的动机和目标：

1. 目前 300 多行源代码集中在 src/App.js 中，希望重构后能分散到多个源文件中；
2. 目前主要业务逻辑都集中在 App 组件上，希望重构后能分摊到其他组件；
3. 将 CSS-in-JS 样式代码直接写在 JSX 标签上有点喧宾夺主，希望重构后能独立些。


#### 重构第一步：抽取组件到独立文件

根据社区常见的代码约定（Convention），我们希望与文件名同名的组件是这个文件的默认导出项。让我们再做两个重构操作。首先选中 KanbanBoard 变量名，打开重构菜单，选择“转换为命名函数”，这样可以保证组件在 React 开发者工具中有显示名称：



