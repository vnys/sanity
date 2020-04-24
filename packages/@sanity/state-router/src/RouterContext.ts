import React, {useContext, useState, useEffect} from 'react'
import {InternalRouter} from './components/types'

const missingContext = () => {
  throw new Error('No router context provider found')
}

const missingRouter: InternalRouter = {
  channel: {subscribe: missingContext, publish: missingContext},
  getState: missingContext,
  navigate: missingContext,
  navigateIntent: missingContext,
  navigateUrl: missingContext,
  resolveIntentLink: missingContext,
  resolvePathFromState: missingContext
}

export const RouterContext = React.createContext(missingRouter)
export const useRouter = () => useContext(RouterContext)
export const useRouterState = (deps?: string[]) => {
  const router = useContext(RouterContext)
  const [routerState, setState] = useState(router.getState())

  let dependencies
  if (deps) {
    dependencies = deps.map(key => routerState[key])
  }

  useEffect(() => {
    let defer

    const unsubscribe = router.channel.subscribe(() => {
      defer = setTimeout(() => setState(router.getState()), 0)
    })

    return (): void => {
      clearTimeout(defer)
      unsubscribe()
    }
  }, dependencies)

  return routerState
}
