### 1. Vue3.0性能提升主要是通过哪几方面体现的？

- 源码组织方式的变化
    - 源码采用Ts重写
    - 使用Monorepo管理项目结构
- CompositionAPI
    - Vue.js 3.0新增的一组API
    - 一组基于函数的API
    - 可以更灵活的组织组件的逻辑
- 性能提升
    - 响应式系统升级
    - 编译优化
    - 源码体积的优化

### 2、Vue 3.0所采用的Composition Api与Vue 2.x使用的Options Api有什么区别?

**Options API**

- 包含一个描述组件选项(data、methods、props等)的对象
- Options APIl开发复杂组件，同一个功能逻辑的代码被拆分到不同选项

**Composition APl**

- Vue.js 3.0新增的一组 API
- —组基于函数的 API
- 可以更灵活的组织组件的逻辑

### 3、Proxy相对于Object.defineProperty有哪些优点?

**Proxy 的优势如下:**

- Proxy 可以直接监听对象而非属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

**Object.defineProperty 的优势如下:**

- 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本( 3.0 )才能用 Proxy 重写。

### 4、Vue 3.0在编译方面有哪些优化?

**响应式系统升级**

- Vue.js 2.x中响应式系统的核心defineProperty
- Vue.js 3.0中使用Proxy对象重写响应式系统
    - 可以监听动态新增的属性
    - 可以监听删除的属性
    - 可以监听数组的索引和length属性

**编译优化**

- Vue.js 2.x中通过标记静态根节点，优化diff 的过程
- Vue.js 3.0中标记和提升所有的静态根节点，diff 的时候只需要对比动态节点内容
    - Fragments(升级vetur插件)
    - 静态提升
    - Patch flag
    - 缓存事件处理函数

**源码体积的优化**

- Vue.js 3.0中移除了一些不常用的 API
    - 例如:inline-template、filter 等
- Tree-shaking

### 5、Vue.js 3.0响应式系统的实现原理?

- Proxy对象实现属性监听
- 默认监听动态添加的属性
- 默认监听属性的删除操作
- 默认监听数组索引和 length属性
- 可以作为单独的模块使用
- 多层属性嵌套，在访问属性过程中处理下一级属性

**具体是由以下几个函数来组合完成的**

- reactive：
    - 接收一个参数，判断这参数是否是对象。不是对象则直接返回这个参数，不做响应式处理
    - 创建拦截器对象 handler, 设置 get/set/deleteProperty
        - get
            - 收集依赖（track）
            - 返回当前 key 的值。
                - 如果当前 key 的值是对象，则为当前 key 的对象创建拦截器 handler, 设置 get/set/deleteProperty
                - 如果当前的 key 的值不是对象，则返回当前 key 的值
        - set
            - 设置的新值和老值不相等时，更新为新值，并触发更新（trigger）
        - deleteProperty
            - 当前对象有这个 key 的时候，删除这个 key 并触发更新（trigger）
    - 返回 Proxy 对象
- effect：接收一个函数作为参数。作用是：访问响应式对象属性时去收集依赖
- track：
    - 接收两个参数：target 和 key
    - 如果没有 activeEffect，则说明没有创建 effect 依赖
    - 如果有 activeEffect，则去判断 WeakMap 集合中是否有 target 属性，
        - WeakMap 集合中没有 target 属性，则 set(target, (depsMap = new Map()))
        - WeakMap 集合中有 target 属性，则判断 target 属性的 map 值的 depsMap 中是否有 key 属性
            - depsMap 中没有 key 属性，则 set(key, (dep = new Set()))
            - depsMap 中有 key 属性，则添加这个 activeEffect
- trigger：
    - 判断 WeakMap 中是否有 target 属性
        - WeakMap 中没有 target 属性，则没有 target 相应的依赖
        - WeakMap 中有 target 属性，则判断 target 属性的 map 值中是否有 key 属性，有的话循环触发收集的 effect()
