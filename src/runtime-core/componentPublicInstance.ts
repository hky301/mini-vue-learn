// TODO:可以按照文档实现其他 https://vuejs.org/api/component-instance.html
const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}


export const PublicInstanceProxyHandlers =
{
  get({ _: instance }, key) {
    const { setupState } = instance
    if (key in setupState) {
      return setupState[key]
    }

    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) return publicGetter(instance)

  }
}
