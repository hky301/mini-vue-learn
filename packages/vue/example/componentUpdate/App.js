import { h, ref } from "../../dist/guide-mini-vue.esm.js"
import Child from './Child.js'

export const App = {
  setup() {
    const msg = ref('123')
    const count = ref(1)

    window.msg = msg

    const changeChildren = () => {
      msg.value = '456'
    }

    const changeCount = () => {
      count.value++
    }

    return {
      msg,
      changeChildren,
      changeCount,
      count
    }
  },
  render() {
    return h('div', {}, [
      h('div', {}, '你好'),
      h('button', {
        onClick: this.changeChildren
      },
        'change child props'
      ),
      h(Child, {
        msg: this.msg,
      }),
      h('button', {
        onClick: this.changeCount
      },
        'change self count'
      ),
      h('p', {}, 'count: ' + this.count)
    ])
  }
}
