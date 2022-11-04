


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









## 什么是副作用


副作用 （Side-effect， 或简称Effect） 这个概念在上节课已经多次出现了， 你可能还是觉得迷惑， 到底什么是副作用呢？

当调用函数时，除了返回可能的函数值之外，还对主调用函数产生附加的影响。例如修改全局变量，修改参数，向主调方的终端、管道输出字符或改变外部存储信息等。

总之， 副作用就是让一个函数不再是纯函数的各类操作。 注意，这个概念并不是贬义的， 在React中， 大量行为都可以被称作副作用， 比如挂载，更新、卸载组件、事件处理、
添加定时器、修改真实DOM、请求远程数据、在console中打印调试信息、等等。



上节课提到 state，其实是绑定在组件函数之外的 FiberNode 上的。这让你想到了什么？对的，组件函数执行 state 更新函数从逻辑上讲也是一种副作用。



## 副作用 Hooks：useEffect

面对这么多副作用，React 大大方方地提供了 useEffect 这个执行副作用操作的 Hook。当你打算在函数组件加入副作用时，useEffect 基本上会成为你的首选。同时也建议你务必把副作用放在 useEffect 里执行，而不是直接放在组件的函数体中，这样可以避免很多难以调试的 Bug。


useEffect 这个 Hook 有几种用法。首先最简单的用法，只传入一个没有返回值的副作用回调函数（Effect Callback）：


``` js

useEffect(() => {/* 省略 */});
//        -----------------
//                ^
//                |
//           副作用回调函数
```


虽然 useEffect 作为组件函数体的一部分，在每次组件渲染（包括挂载和更新阶段）时都会被调用，但作为参数的副作用回调函数是在提交阶段才会被调用的，这时副作用回调函数可以访问到组件的真实 DOM。


虽然这是最简单的用法，但现实中的用例反而比较少：毕竟每次渲染后都会被调用，如果使用不当，容易产生性能问题。这里提到了上节课讲到的渲染阶段和提交阶段，我把当时画的图贴过来，方便你参考。


接下来就是最常用的用法：副作用的条件执行。在上面用法的基础上，传入一个依赖值数组（Dependencies）作为第二个参数：




React在渲染组件时， 会记录下当时的依赖值数组， 下次渲染时会把依赖值数组里的值一次与前一次记录下来的值做浅比较。 如果有不通，才会在提交阶段执行副作用回调函数， 否则就跳过这次执行，下次渲染再继续对比依赖值数组。

依赖值数组里可以加入 props、state、 context值。 一般来说， 只要副作用回调函数中用到了自己范围之外的变量， 都应该加入到这个数组里， 这样React才能知道应用状态的变化和副作用间的因果关系。


下面来一个级联菜单的例子，当省份 state 值更新时，副作用回调函数会根据省份来更新城市列表，而城市列表也是一个 state，state 更新会使组件重新渲染（rerender），以达到刷新二级菜单选项的目的。


``` js
//   ------------   --------------
//   | 省份... |v|   | 城市...  |v|
//   ------------   --------------
const [province, setProvince] = useState(null);
const [cities, setCities] = useState([]);
useEffect(() => {
  if (province === '山东') {
    // 这些数据可以是本地数据，也可以现从服务器端读取
    setCities(['济南', '青岛', '淄博']);
  }
}, [province]);
```

空数组[]也是一个有效的依赖值数组，由于在组件生命周期中依赖值不会有任何变化，所以副作用回调函数只会在组件挂载时执行一次，之后不论组件更新多少次，副作用都不会再执行。这个用法可以用来加载远程数据。




useEffect 接收了副作用回调函数和依赖值数组两个参数，其中副作用回调函数的返回值也是一个函数，这个返回的函数叫做清除函数。组件在下一次提交阶段执行同一个副作用回调函数之前，或者是组件即将被卸载之前，会调用这个清除函数。同时定义副作用回调函数、清除函数和依赖值数组，这是 useEffect 最完整的一种用法。


``` js

useEffect(() => {/* 省略 */; return () => {/* 省略 */};}, [status]);
//        ------------------------------------------     -------
//                       ^         -----------------        ^
//                       |                 ^                |
//                  副作用回调函数         清除函数         依赖值数组
```




4副作用 Hooks 除了useEffect，还有一个名字类似、用法也类似的useLayoutEffect。它的副作用执行时机一般早于前者，是在真实 DOM 变更之后同步执行的，更接近类组件的componentDidMount 、componentWillUnmount 。为保证性能，应尽量使用 useEffect 以避免阻塞。




## 性能优化 Hooks：useMemo 和 useCallback

接下来，趁着你对 useEffect 的参数形式印象深刻，我们占用一小部分篇幅，了解一下用于组件性能优化的 Hooks：useMemo 和 useCallback。

其实这两个 Hooks 与 useEffect 并不沾亲带故。且不说它们的用途完全不同，单从回调函数的执行阶段来看，前者是在渲染阶段执行，而后者是在提交阶段。看起来它们最大的相似点，在于 Hook 的第二个参数都是依赖值数组。


这里插入一个概念：记忆化（Memoization），对于计算量大的函数，通过缓存它的返回值来节省计算时间，提升程序执行速度。对于记忆化函数的调用者而言，存入缓存这件事本身就是一种副作用。useMemo 和 useCallback 做性能优化的原理就是记忆化，所以它们的本质和 useEffect 一样，都是在处理副作用。

先来看一下useMemo ，这个 Hook 接受两个参数，一个是工厂函数（Factory），另一个是依赖值数组，它的返回值就是执行工厂函数的返回值：


``` js

const memoized = useMemo(() => createByHeavyComputing(a, b), [a, b]);
//    --------           ----------------------------------  ------
//       ^                            ^                         ^
//       |                            |                         |
//   工厂函数返回值                   工厂函数                  依赖值数组
```


useMemo 的功能是为工厂函数返回一个记忆化的计算值，在两次渲染之间，只有依赖值数组中的依赖值有变化时，该 Hook 才会调用工厂函数重新计算，将新的返回值记忆化并返回给组件。

useMemo 最重要的使用场景，是将执行成本较高的计算结果存入缓存，通过减少重复计算来提升组件性能。我们依旧用上节课的斐波那契数列递归函数来举例，从 state 中获取num ，转换成整数n 后传递给函数 ，即计算第 n 个斐波那契数：

``` js
const [num, setNum] = useState('0');
const sum = useMemo(() => {
  const n = parseInt(num, 10);
  return fibonacci(n);
}, [num]);
```

``` 
状态num 的初始值是字符串 '0' ，组件挂载时 useMemo 会执行一次 fibonacci(0) 计算并返回 0 。如果后续通过文本框输入的方式修改 num 的值，如 '40' ， '40' 与上次的 '0' 不同，则 useMemo 再次计算 fibonacci(40) ，返回 102334155 ，如果后续其他 state 发生了改变，但 num 的值保持 '40' 不变，则 useMemo 不会执行工厂函数，直接返回缓存中的 102334155 ，减少了组件性能损耗。
``` 


然后是 useCallback ，它会把作为第一个参数的回调函数返回给组件，只要第二个参数依赖值数组的依赖项不改变，它就会保证一直返回同一个回调函数（引用），而不是新建一个函数，这也保证了回调函数的闭包也是不变的；相反，当依赖项改变时， useCallback 才会更新回调函数及其闭包。


``` js

const memoizedFunc = useCallback(() => {/*省略*/}, [a, b]);
//    ------------               ---------------   -----
//         ^                            ^            ^
//         |                            |            |
//   记忆化的回调函数                   回调函数      依赖值数组
```




其实 useCallback 是 useMemo 的一个马甲，相当于：

``` js

const memoizedFunc = useMemo(() => () => {/*省略*/}, [a, b]);
//    ------------           ---------------------   -----
//       ^                      ^  ---------------      ^
//       |                      |         ^             |
// 工厂函数返回的回调函数        工厂函数   回调函数        依赖值数组
```


如果你还记得，上节课讲什么是纯函数时，我们顺带提到了纯组件的特性：当组件的 props 和 state 没有变化时，将跳过这次渲染。而你在函数组件内频繁声明的事件处理函数，比如 handleSubmit ，在每次渲染时都会创建一个新函数。


如果把这个函数随着 props 传递给作为子组件的纯组件，则会导致纯组件的优化无效，因为每次父组件重新渲染都会带着子组件一起重新渲染。这时就轮到useCallback 出马了，使用妥当的话，子组件不会盲目跟随父组件一起重新渲染，这样的话，反复渲染子组件的成本就节省下来了。


## Hooks 的使用规则

我们前面学习了基础的状态和副作用 Hooks，以及部分扩展 Hooks，相信你对这种函数式的 API 有了更进一步的了解。

虽然借鉴了很多函数式编程的特性，Hooks 本身也都是 JavaScript 函数，但 Hooks 终归是一套 React 特有的 API，使用 Hooks 并不等于函数式编程，也不能把函数式编程的各种最佳实践完整地搬到 Hooks 身上。


比起传统的函数式编程，有两条限制，需要你在使用 Hooks 时务必注意。

第一，**只能在 React 的函数组件中调用 Hooks**。这也包括了在自定义的 Hook 中调用其他 Hooks 这样间接的调用方式，目的是保证 Hooks 能“勾”到 React 的虚拟 DOM 中去，脱离 React 环境的 Hooks 是无法起作用的。


第二，只能在组件函数的最顶层调用 Hooks。无论组件函数运行多少遍，都要保证每个 Hook 的执行顺序，这样 React 才能识别每个 Hook，保持它们的状态。当然，这就要求开发者不能在循环、条件分支中或者任何 return 语句之后调用 Hooks。


其实从 Fiber 协调引擎的底层实现来看，也不难理解上面两个限制。函数组件首次渲染时会创建对应的 FiberNode，这个 FiberNode 上会保存一个记录 Hooks 状态的单向链表，链表的长度与执行组件函数时调用的 Hooks 个数相同：




当函数组件再次渲染时，每个 Hook 都会被再次调用，而这些 Hooks 会按顺序，去这个单向链表中一一认领自己上一次的状态，并根据需要沿用或者更新自己在链表中的状态：

