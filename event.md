## 事件处理


React 里内建了一套名为合成事件（SyntheticEvent）的事件系统，和 DOM 事件有所区别。不过第一次接触到合成事件概念的开发者，常会有以下疑问：

- 什么是 React 合成事件？
- 为什么要用合成事件而不直接用原生 DOM 事件？
- 合成事件有哪些使用场景？
- 有哪些场景下需要使用原生 DOM 事件？



合成事件的底层仍然是 DOM 事件，但隐藏了很多复杂性和跨浏览器时的不一致性

更易于在 React 框架中使用。在 oh-my-kanban 出现过的受控组件，就是合成事件的重要使用场景之一。此外，我们还会利用其他合成事件为看板卡片加入拖拽功能，顺便了解一下合成事件的冒泡捕获机制。最后，我会介绍一些在 React 中使用原生 DOM 事件的场景。



### 什么是 React 合成事件？

``` html

<!-- 这是HTML不是JSX -->
<button onclick="handleClick()">按钮</button>
<input type="text" onkeydown="handleKeyDown(event)" />
```

在 React 中，HTML 元素也有类似的、以 on* 开头的事件处理属性。最直接的不同是，这些属性的命名方式遵循驼峰格式（camelCase），如onClick、onKeyDown。在 JSX 中使用这些属性时，需要传入函数，而不能是字符串：


``` js

const Component = () => {
  const handleClick = () => {/* ...省略 */};
  const handleKeyDown = evt => {/* ...省略 */};
  return (
    <>
      {/* 这次是JSX了 */}
      <button onClick={handleClick}>按钮</button>
      <input type="text" onKeyDown={evt => handleKeyDown(evt)} />
    </>
  );
};
```




以上面的 button 为例，开发者将 handleClick 函数传入 onClick 属性。在浏览器中，当用户点击按钮时，handleClick 会被调用，无论开发者是否需要，React 都会传入一个描述点击事件的对象作为函数的第一个参数。而这个对象就是 React 中的合成事件（SyntheticEvent）。


合成事件是原生 DOM 事件的一种包装，它与原生事件的接口相同，根据 W3c 规范，React 内部规范化（Normalize）了这些接口在不同浏览器之间的行为，开发者不用再担心事件处理的浏览器兼容性问题。


## 合成事件与原生 DOM 事件的区别

包括刚才提到的，对事件接口在不同浏览器行为的规范化，合成事件与原生 DOM 事件之间也有着一系列的区别


### 注册事件监听函数的方式不同

监听原生 DOM 事件基本有三种方式。


1. 与 React 合成事件类似的，以内联方式写在 HTML 标签中：
``` js

<button id="btn" onclick="handleClick()">按钮</button>
```


2. 在 JS 中赋值给 DOM 元素的事件处理属性：

``` js

document.getElementById('btn').onclick = handleClick;
```

3. 在 JS 中调用 DOM 元素的 addEventListener 方法（需要在合适时机调用 removeEventListener 以防内存泄漏）：
``` js

document.getElementById('btn').addEventListener('click', handleClick);
```



而合成事件不能通过 addEventListener 方法监听，它的 JSX 写法等同于 JS 写法：


``` js

const Button = () => (<button onClick={handleClick}>按钮</button>);
// 编译为
const Button = () => React.createElement('button', {
  onClick: handleClick
}, '按钮');
```

有时我们需要以捕获方式监听事件，在原生事件中以addEventListener 方法加入第三个参数：

``` js
div.addEventListener('click', handleClick, true);
```



``` js
() => (<div onClickCapture={handleClick}>...</div>);
```

### 特定事件的行为不同


React 合成事件规范化了一些在各个浏览器间行为不一致，甚至是在不同元素上行为不一致的事件，其中有代表性的是 onChange 。


而在 React 中， <input>\<textarea> 和 <select> 三种表单元素的onChange 合成事件被规范成了一致的行为：在不会导致显示抖动的前提下，表单元素值的改变会尽可能及时地触发这一事件。




以文本框为例，同样是输入一句话，合成 change 事件发生的次数要多于原生的次数，在onChange 事件处理函数被调用时，传入的事件对象参数提供的表单元素值也尽可能是最新的。

顺便提一下，原生 change 事件行为的不一致，只是前端领域浏览器兼容性问题的冰山一角。React 这样的框架为我们屏蔽了这些疑难杂症，我们在享受便利的同时，也需要知道框架们在负重前行。



除了 onChange ，合成事件也规范化了 onBeforeInput 、 onMouseEnter 、 onMouseLeave 、 onSelect 。



## 实际注册的目标 DOM 元素不同


对于下面这个原生 DOM 事件，它的当前目标（ event.currentTarget ）是很明确的，就是 ID 为 btn 的按钮：

``` js

document.getElementById('btn').addEventListener('click', handleClick);
```


但合成事件就不一样了！我们在 oh-my-kanban 的代码，“添加新卡片”的 onClick 事件处理函数 handleAdd 中设个断点，传入的 evt 参数就是一个合成事件，已知通过 evt.nativeEvent 属性，可以得到这个合成事件所包装的原生事件。

看一下这几个值：

``` js

evt.currentTarget
evt.target
evt.nativeEvent.currentTarget
evt.nativeEvent.target
```

可以看到，不出意外地，两种事件的 target 都是按钮元素本身，合成事件的 currentTarget 也是按钮元素，这是符合 W3c 规范的；但原生事件的 currentTarget 不再是按钮，而是 React 应用的根容器 DOM 元素.

这是因为 React 使用了事件代理模式。React 在创建根（ createRoot ）的时候，会在容器上监听所有自己支持的原生 DOM 事件。当原生事件被触发时，React 会根据事件的类型和目标元素，找到对应的 FiberNode 和事件处理函数，创建相应的合成事件并调用事件处理函数。


从表层接口上看，合成事件的属性是符合 W3C 事件规范的，这就屏蔽了不同浏览器原生 DOM 事件可能产生的不一致。



## 受控组件与表单


表单处理是前端领域一个常见需求，在 React 中也是一个重要场景。我们看一下目前 oh-my-kanban 项目中唯一的表单代码（省略了部分代码）：


``` js

const KanbanNewCard = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };
  // ...省略

  return (
    <li>
      <h3>添加新卡片</h3>
      <div>
        <input type="text" value={title} onChange={handleChange} />
      </div>
    </li>
  );
};
```


用户在文本框中输入文本时，会触发 onChange 合成事件，调用 handleChange(evt) 函数，handleChange 函数又会将文本框变更后的值保存在组件 state title 中，state 的变化导致组件重新渲染，文本框的当前值会更新成 title ，与刚才的更新值保持一致.


可以看出，这一过程形成了一个闭环。这种以 React state 为单一事实来源（Single Source of Truth），并用 React 合成事件处理用户交互的组件，被称为“受控组件”。



其实看板新卡片组件里文本框的 onKeyDown ，可以看作是提交表单。用户按回车后， handleKeyDown 函数会通过 onSubmit 属性将表单值传给父组件：

``` js

const KanbanNewCard = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };
  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      onSubmit(title);
    }
  };

  return (
    <li>
      <h3>添加新卡片</h3>
      <div>
        <input type="text" value={title}
          onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  );
};
```

你也可以选择显式地将这些表单元素集中在一个
表单里，这样你就可以利用表单的 onSubmit 事件来规范提交表单的时机。但要注意，这里需要禁用掉表单提交事件的默认行为：

``` js

const Form = () => {
  // ...省略
  const handleSubmit(evt) {
    console.log('表单元素state');
    evt.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      {/* 省略 */}
      <input type="submit" value="提交" />
    </form>
  );
};
```


## 合成事件的冒泡与捕获

接下来，我们就利用刚学到的 React 事件处理，上手继续为 oh-my-kanban 添加功能，其间也会涵盖合成事件的冒泡和捕获机制。

在三个看板列间，还有进一步的交互。
对于任意看板列里的任意卡片，可以用鼠标拖拽到其他的看板列；
在释放拖拽时，被拖拽的卡片插入到目标看板列，并从原看板列中移除.


我们简单分析一下这个需求。将被拖拽的项目是看板卡片，有效的放置目标是看板列，放置成功时会移动这张卡片。这样的交互对应的数据逻辑如下：

被拖拽的卡片对应的数据，是待处理、进行中或已完成数组的其中一个成员；
放置成功时，该成员会从源头数组中移除，同时会添加到目标数组中。



那基本上就可以确定这个需求的实现方法了：

- 在看板列和看板卡片组件元素上，需要分别监听拖拽事件；
- 在组件状态中应记录当前被拖拽卡片的数据，以及哪个看板列对应的的数组是拖拽源头，哪个是放置目标。


现在来到 oh-my-kanban 的 src/App.js 文件，让我们先为看板卡片 KanbanCard 组件的
元素添加 draggable 和 onDragStart 属性：




### 什么时候使用原生DOM事件？


## 小总结



一般情况下，React 的合成事件已经能满足你的大部分需求了，有两种情况例外。

1. 需要监听 React 组件树之外的 DOM 节点的事件，这也包括了 window 和 document 对象的事件。注意注意的是，在组件里监听原生 DOM 事件，属于典型的副作用，所以请务必在 useEffect 中监听，并在清除函数中及时取消监听。如：

2. 很多第三方框架，尤其是与 React 异构的框架，在运行时会生成额外的 DOM 节点。在 React 应用中整合这类框架时，常会有非 React 的 DOM 侵入 React 渲染的 DOM 树中。当需要监听这类框架的事件时，要监听原生 DOM 事件，而不是 React 合成事件。这同样也是 useEffect 或 useLayoutEffect 的领域。当然，只要你知道原理，也完全可以用原生 DOM 事件加上一些特殊处理来替代合成事件，但这种做法就没那么“React”了。


小结这节课我们介绍了 React 合成事件，知道了合成事件是原生 DOM 事件的一种规范化的封装，也了解了它在注册监听方式、onChange 等特定事件的行为、实际注册的目标 DOM 这三个方面与原生 DOM 事件的区别。然后在 oh-my-kanban 代码基础上，我们进一步学习了受控组件和表单处理，也上手为看板加入了卡片拖拽的功能，并顺路实践了合成事件的事件冒泡和事件捕获。最后，我们还列举了一些合成事件力不能及，必须监听原生 DOM 事件的场景。按照老规矩，这里我也附上本节课所涉及的项目源代码：https://gitee.com/evisong/geektime-column-oh-my-kanban/releases/tag/v0.11.0。

