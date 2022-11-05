

我们学习的所有 React 概念都可以是 React 组件的接口实现，包括 props、state、context、事件处理、Hooks、子组件、组件样式等。在设计一个 React 组件时，开发者需要斟酌外部接口和内部实现的关系，这包括但不限于：哪些字段作为 props 暴露出来？哪些抽取为 context 从全局获取？哪些数据实现为组件内部的 state？这些问题我们在接下来的 oh-my-kanban 大重构第二步中一一揭晓。


## 重构第二步：将逻辑转移到各组件中

这是 大重构第一步的后续。在重构第二步， 我们会把KanbanCard逻辑转移到KanbanColumn中，
把KanbanColumn逻辑转移到KanbanBoard中。


2.1 将KanbanCard逻辑转移到KanbanColumn中

首先， 我们重新审视一下KanbanColumn的职责。




App 的情况又有不同。它的四个 state 都通过 props 传给了 KanbanBoard，同时它还把三个看板列数组的 state 更新函数做了封装，把 Add 和 Remove 的回调函数下放给了 KanbanBoard 和 KanbanColumn。重构上头的你跃跃欲试：“能把 App 的四个 state 转移到 KanbanBoard 里吗？”如果这样做，就意味着你需要把读写 localStorage 的逻辑也移到 KanbanBoard 里。这引出了一个问题，“保存所有卡片”的按钮是放在 App 标题栏的，总不能把标题栏也移到 KanbanBoard 里吧？毕竟逻辑上太不相关了。这时我们就认为，这四个 state 是 App 标题栏和 KanbanBoard 的共享应用状态，需要放在 App 标题栏和 KanbanBoard 共同的父组件中（虽然我们没有把 App 标题栏抽取成独立的组件，但逻辑上是一样的）。这个过程被称作状态提升（Lifting State Up），也是我们在做 React 组件设计开发时会经常用到的一个技巧。



