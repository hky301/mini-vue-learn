import { hasOwn } from "@mini-vue/shared"

// TODO:可以按照文档实现其他 https://vuejs.org/api/component-instance.html
const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
  $props: (i) => i.props,
}


export const PublicInstanceProxyHandlers =
{
  get({ _: instance }, key) {
    const { setupState, props } = instance

    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }

    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) return publicGetter(instance)

  }
}
