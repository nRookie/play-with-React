
## 
关于 props、state 和 context 的细节，我依然计划留到后面的课程讲解。在这里先划出一个重点，props 和 state 都是不可变的（Immutable）。


在 React 的早期版本，协调是一个同步过程，而从 React v16 开始，协调从之前的同步改成了异步过程，在 React 中更贴近虚拟 DOM 的，是在 Fiber 协调引擎中的核心模型 FiberNode。


### install emotion

``` shell
npm install @emotion/react
```



## Fiber 协调引擎

为了提高协调效率，减少页面交互卡顿， React 的Fiber 引擎把协调从同步过程改进成了异步过程。


渲染阶段是异步过程， 主要负责更新虚拟DOM (FiberNode) 树， 而不会操作真实DOM， 这一过程可能会被React
暂停和恢复， 甚至并发处理， 因此要求渲染阶段的生命周期方法必须是没有任何副作用(side-effect) 的纯函数（Pure function）；

- 提交阶段是同步过程， 根据渲染阶段的比对结果修改真实DOM，这一阶段的生命周期方法可以包含副作用。


## 用 Hooks 定义函数组件生命周期


### 生命周期的常见使用场景

还有一些组合多个生命周期阶段的模式。

比如“在组件挂在时XXX， 卸载时YYY“ 模式。 


## Hooks

### 什么事Hooks ?


Hooks 是React 实现组件逻辑的重要方式， 可以用来操作state, 定义副作用， 更支持开发者自定义Hooks, Hooks 借鉴自函数式编程，但同时在使用上也有一些限制。

React 对 UI的理想模型是 UI=f(state), 其中 UI是视图, state 是应用状态， f则是渲染过程。 比起类组件， 函数组件更加贴近这一模型， 但从功能来看，早期的函数组件功能与
类组件仍有不小的差距。

纯函数（Pure function）。 当一个函数满足如下条件时， 就可以被认为是纯函数。

1. 函数无论被调用多少次，只要参数相同，返回值就一定相同， 这一过程不受外部状态或者IO操作的影响。

2. 函数被调用时不会产生副作用（Side Effect）， 即不会修改传入的引用参数， 不会修改外部状态， 不会触发IO操作， 也不会掉用其他会产生副作用的函数。

下面这段JS代码就是一个最简单的纯函数， 对于给定的a和b， 返回值永远都是两者之和。

``` js

const func = (a, b) => {
  return a + b;
};
```

``` js
const Component = ({ a, b }) => { return (
{a}
{b}
);};
```
Hooks 就时这样一套为函数组件设计的， 用于访问React内部状态或执行副作用操作， 以函数形式存在的 React API。 注意，
这里提到的“React 内部状态” 是比组件state 更广义的统称， 除了state外， 还包括后面课程中会详细讲解的 context， memo、 ref等。

作为例子， 我们在上面的“ 纯虚函数组件”代码中加入Hooks。 useState 这一Hooks会读取或存储组件的state， 加入它， 让函数组件具有了操作state 的能力。


``` js
const Component = ({a, b}) => {
    const [m, setM] = useState(a);
    const [n, setN] = useState(b);
    return (
        <ul>
            <li> {m} <button onClick={ () => setM(m + 1)}> + </button></li>
            <li>{n} <button onClick={ () => setN(n + 1)}> + </button></li>
        </ul>
    );
};
```

要注意一点， 组件的state 并不是绑定在组件的函数上的，而是组件渲染产生的虚拟DOM节点， 也就是 FiberNode上的。
所以在上面的函数中掉用 useState， 意味着函数将访问函数本身以外、 React以内的状态， 这就让函数产生了副作用， 导致函数不再是纯函数。
也意味着函数组件不再是“纯函数组件”。

在React 里有一个概念叫“纯组件”， 它不等于纯函数组件。
纯组件 Pure Component是一个主要用于性能优化的独立API：
当组件的props和state 没有变化时， 将跳过这次渲染， 直接沿用上次渲染的结果。

而上面的函数组件， 每次在渲染阶段都会被执行，如果返回的元素树经过协调引擎比对后，
与前一次的没有差异， 则在提交阶段不会更新对应的真实DOM。

