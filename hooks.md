


### React Hooks 有哪些？

1. useState
2. useEffect
3. useContext

其他 Hooks，有些是上面基础 Hooks 的变体，有些虽然用途不同，但与基础 Hooks 共享底层实现。包括十个：

1. useRender
2. useMemo
3. useCallbak
4. useRef
5. useImperativeHandle
6. useLayoutEffect
7. useDebugValue
8. useDeferredValue
9. useTransition
10. useId



此外还有为第三方库作者提供的 useSyncExternalStore 和 useInsertionEffect 。虽然 React API 中提供了这么多 Hooks，但并不意味着你每个 Hook 都要精通。

首先精通三个基础 Hooks，也就是 useState 、 useEffect 和 useContext。然后在此基础上：

1. 掌握useRef的一般用户；
2. 当需要优化性能， 减少不必要的渲染时， 学习掌握 useMemo 和useCallback；
3. 当需要在大中型 React 项目中处理复杂state时， 学习掌握useReducer。
4. 当需要封装组件，对外提供命令式接口时， 学习掌握useRef加useImperativeHandle；
5. 当页面上用户操作直接相关的紧急更新（Urgent updates， 如输入文字、点击、拖拽等）， 受到异步渲染拖累而产生卡顿，需要优化时， 学习掌握 useDeferredValue 和useTransition。

其中基础 Hooks 的 useState 和 useEffect ，我们分别会在这节课和下节课详细讲解，useContext 涉及到 Context，我们留到 12～13 节课再展开。

基础 Hooks 之外，useRef 也是用来操作数据的，而且相对独立，我们放在这节课末尾来讲。useMemo 和 useCallback 在接口形式上与 useEffect 有相似之处，一并放到下节课介绍。


### 状态 Hooks

操作state的Hook 包括基础的useState 和它的变体
useReducer， 我们马上会学习到。 多提一下， 其中 useState是所有Hooks中最常用的（没有之一， 遥遥领先），
之所以说最常用，是因为开发者经常在一个组件里写多个useState来操作多个state。

在组件内部改变 state 会让组件重新渲染。

``` js

import React, { useState } from 'react';
// ...省略
function App() {
  const [showAdd, setShowAdd] = useState(false);
  //     -------  ----------             -----
  //        ^         ^                    ^
  //        |         |                    |
  //    state变量  state更新函数           state初始值
  const [todoList, setTodoList] = useState([/* ...省略 */]);
```

组件代码可以通过 showAdd 变量读取这个 state，当需要更新这个 state 时，则调用 setShowAdd 函数，如 setShowAdd(true) 。
每次组件更新，在渲染阶段都会再次调用这个useState 函数，但它不会再重新初始化 state，而是保证 showAdd 值是最新的。



上面提到每次组件更新都会调用useState ，这其实是有性能隐患的。你可能好奇，useState(false) 得调用多少次才能影响到性能啊？而且，不是说它不会再重新初始化 state 吗？


确实，框架提供的 useState 本身不会这么弱的。不过，useState 的参数就不一定了。现在的参数是一个简单的布尔值，但如果它是一个复杂的表达式呢？每次组件更新执行渲染时，即使这个表达式的值不会被 useState 再次使用，但表达式本身还是会被执行的。



不妨请你写个简单的斐波那契数列递归函数，然后把执行结果当作参数： useState(fibonacci(40)) ，然后性能肉眼可见地变差了，表达式执行的成本太高了（当然你可以优化函数本身的算法）。但没关系，useState 还有另一种设置默认值的方法，就是传一个函数作为参数，useState 内部只在组件挂载时执行一次这个函数，此后组件更新时不会再执行。

于是刚才的斐波那契初始值就可以这样写：useState(() => fibonacci(40)) 。


有意思的是，state 更新函数，即 setShowAdd 也可以传函数作为参数。一般情况下，是调用 state 更新函数后组件会更新，而不是反过来。所以 state 更新函数的调用频率没那么高，传函数参数也并不是为了优化性能。




这里先给一个背景，调用 state 更新函数后，组件的更新是异步的，不会马上执行；在 React 18 里，更是为更新 state 加入了自动批处理功能，多个 state 更新函数调用会被合并到一次重新渲染中。



这个功能从框架上就保证了 state 变化触发渲染时的性能，但也带来一个问题，只有在下次渲染时 state 变量才会更新为最新值，如果希望每次更新 state 时都要基于当前 state 值做计算，那么这个计算的基准值有可能已经过时了，如：

``` js

setShowAdd(!showAdd);
setTodoList([...todoList, aNewTodoItem]);
```

这时函数参数的作用就体现出来了，只要改为下面的方式，就可以保证更新函数使用最新的 state 来计算新 state 值：

``` js

setShowAdd(prevState => !prevState);
setTodoList(prevState => {
  return [...prevState, aNewTodoItem];
});
```


useState 是 React 最常用的 Hook，理解这个 Hook 对理解其他 Hooks 很有帮助;


### useReducer

这个小节的标题是“状态 Hooks”，之所以有个“s”，是因为 useState 还有一个马甲 useReducer ，如果用 useReducer 来改写上面的 useState ，可以写成这样

``` js

function reducer(state, action) {
  switch (action.type) {
    case 'show':
      return true;
    case 'hide':
    default:
      return false;
  }
}

function App() {
  const [showAdd, dispatch] = useReducer(reducer, false);
  // ...省略
  dispatch({ type: 'show' });
  ```


这么写代码好像变多了？这是因为 useReducer 比起 useState 增加了额外的抽象，引入了dispatch 、action 、reducer 概念。这与著名应用状态管理框架 Redux 基本是对应的。


说到马甲，其实 useState 底层就是基于 useReducer 实现的，useState 才是马甲。useReducer 适用于抽象封装复杂逻辑，对于现在的 oh-my-kanban 项目是没必要的。

更新 state 的自动批处理

前面提到更新 state 的批处理，为什么需要批量更新 state 呢？我们先回顾一下 oh-my-kanban 中，添加新卡片按回车键后发生的事情。

可以看到，在事件处理函数中先后更新了 todoList 和 showAdd 两个 state 值：

``` js
function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState([/*省略*/]);
  // ...省略
  const handleSubmit = (title) => {
    setTodoList(currentTodoList => [
      { title, status: new Date().toString() },
      ...currentTodoList
    ]);
    setShowAdd(false);
  };
  // ...省略
  return (
    <div className="App">
      {/*省略*/}
      {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
      {/*省略*/}
    </div>
  );
}
```



组件内的 state 被更新了，组件就会重新渲染。那么接连更新两个 state，组件会重新渲染几次呢？答案是，在上面的代码中，组件只会重新渲染一次，而且这次渲染使用了两个 state 分别的最新值。这就是 React对多个 state 更新的自动批处理。


我们可以想象一下，假设没有批处理功能的话，这两个 state 更新会触发两次间隔非常近的重新渲染，那前面的这次重新渲染对于用户来说，很有可能是一闪而过的，既没有产生实际交互，也没有业务意义。在此基础上，如果再加上前面这次渲染的成本比较高，那就更是一种浪费了。

所以可以说，state 更新的自动批处理是 React 确保组件基础性能的重要功能。然而需要注意的是，自动批处理功能在 React 18 版本以前，只在 React 事件处理函数中生效。如果 state 更新语句所在的区域稍有不同，比如将两个 state 更新写在异步请求的回调函数中，自动批处理就失效了。用下面的代码举个例子。在点击搜索按钮后，会向服务器端发起搜索请求，当返回结果时，需要先后更新两个 state：


``` js

const Search = () => {
  const [province, setProvince] = useState(null);
  const [cities, setCities] = useState([]);
  const handleSearchClick = () => {
    // 模拟调用服务器端接口搜索"吉林"
    setTimeout(() => {
      setProvince('吉林');
      setCities(['长春', '吉林']);
    }, 1000);
  };
  return (
    <>
      <button onClick={handleSearchClick}>搜索</button>
      <ul>
        <li>{province}<ul>
          {cities.map(city => (
            <li>{city}</li>
          ))}
        </ul></li>
      </ul>
    </>
  );
};
```


看起来写法与 oh-my-kanban 的 handleSubmit 区别不是很大，但在 React 18 以前的版本中，这两个 state 更新会触发两次重新渲染。而从 React 18 版本起，无论是在事件处理函数、异步回调，还是 setTimeout 里的多个 state 更新，默认都会被自动批处理，只触发一次重新渲染。


### 在组件内使用可变值：useRef

前面讲到更新 state 值时，需要使用 state 更新函数。你也许会好奇，既然 useState 返回了 state 变量，直接给 state 变量赋值不行吗？


``` js
showAdd = true
```

``` shell
Uncaught TypeError: invalid assignment to const 'showAdd'
```

这正如在第 6 节课提到的：props 和 state 都是不可变的（Immutable）。




那么，如果需要在 React 组件中使用可变值该怎么办？答案是，我们可以使用 useRef 这个 Hook。下面我们结合一个典型用例，也就是在 React 组件中访问真实 DOM 元素，来介绍 useRef 的用法。


请你为 oh-my-kanban 加入一个提升用户体验的小功能，当打开“添加新卡片”卡片时，自动将其中的文本输入框设置为页面焦点。






``` js

const Component = () => {
  const myRef = useRef(null);
  //    -----          ----
  //      ^              ^
  //      |              |
  //   可变ref对象     可变ref对象current属性初始值

  // 读取可变值
  const value = myRef.current;
  // 更新可变值
  myRef.current = newValue;

  return (<div></div>);
};

```

调用 useRef 会返回一个可变 ref 对象，而且会保证组件每次重新渲染过程中，同一个 useRef Hook 返回的可变 ref 对象都是同一个对象。

可变 ref 对象有一个可供读写的 current 属性，组件重新渲染本身不会影响 current 属性的值；反过来，变更 current 属性值也不会触发组件的重新渲染。在第 12-13 节课中，我们会展开介绍可变值的使用场景。

然后是 HTML 元素的 ref 属性。这个属性是 React 特有的，不会传递给真实 DOM。当 ref 属性的值是一个可变 ref 对象时，组件在挂载阶段，会在 HTML 元素对应的真实 DOM 元素创建后，将它赋值给可变 ref 对象的 current 属性，即 inputElem.current；在组件卸载，真实 DOM 销毁之前，也会把 current 属性设置为 null。





再接下来就是 useEffect(func, []) ，这种使用方法会保证 func 只在组件挂载的提交阶段执行一次，接下来的组件更新时不会再执行。



这三个特性串起来，就让 KanbanNewCard 组件在挂载时，将 
 的真实 DOM 节点赋值给 inputElem.current，然后在处理副作用时从 inputElem.current 拿到这个真实 DOM 节点，命令式地执行它的 focus() 方法设置焦点。


 


