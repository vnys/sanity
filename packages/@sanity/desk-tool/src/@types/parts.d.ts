declare module 'part:*'
declare module 'all:part:*'

declare module '@sanity/base' {
  export type UserColorHue =
    | 'blue'
    | 'cyan'
    // | 'green'
    | 'yellow'
    | 'orange'
    // | 'red'
    | 'magenta'
    | 'purple'
  export interface UserColorManager {
    get: (userId: string) => UserColorHue
  }
  export const useUserColorManager: () => UserColorManager
}

declare module 'part:@sanity/base/router' {
  export * from '@sanity/state-router'

  interface StateLinkProps {
    state?: Record<string, any>
    toIndex?: boolean
  }

  type IntentParameters = Record<string, any> | [Record<string, any>, Record<string, any>]

  type RouterState = Record<string, any>

  export type Router<S = Record<any, any>> = {
    navigate: (nextState: Record<string, any>, options?: NavigateOptions) => void
    navigateIntent: (
      intentName: string,
      params?: IntentParameters,
      options?: NavigateOptions
    ) => void
    state: S
  }

  export const useRouter: () => Router
  export const StateLink: PureComponent<StateLinkProps>
}
