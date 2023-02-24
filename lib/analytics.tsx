export const TRACKING_DOMAIN: string | undefined = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

export const isActive = Boolean(TRACKING_DOMAIN)

export const shouldOutputDebug: boolean = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'

// list all goal types here
export type GoalType =
  | 'SuggestionClick'
  | 'SearchRegisterClick'
  | 'CommitClick'
  | 'Commit'
  | 'CommitFail'
  | 'Register'
  | 'RegisterFail'
  | 'LinkUnresolvedClick'
  | 'SetPrimaryENSClick'
  | 'UpdateProfileClick'

/**
 * A proxy tracking method that abstracts the analytics provider
 * @param event name
 * @param options including additional tracking props
 * @returns
 */
export const trackGoal: TrackingFn = (...args) => {
  if (!isActive) {
    shouldOutputDebug && console.warn('`trackGoal()`', ...args)
    return
  }

  return window.plausible?.(...args)
}

/**
 * Use this component to inject the analytics script
 * @returns JSX that you'll need to embed in <head>
 */
export const AnalyticsScript = () => {
  if (!isActive) return null

  return (
    <>
      <script
        defer
        data-domain={TRACKING_DOMAIN}
        data-api="/stats/event"
        src="/stats/script.js"
      ></script>
      <script>
        {/* To be able to call Plausible before its script is loaded */}
        {`
        window.plausible = window.plausible || function() { 
          (window.plausible.q = window.plausible.q || []).push(arguments) }
        `}
      </script>
    </>
  )
}

/* Type defs */
type TrackingFn = (
  e: GoalType,
  options?: {
    callback?: () => void
    props: { [key: string]: string | number | boolean }
  }
) => void

declare global {
  interface Window {
    plausible: TrackingFn
  }
}
