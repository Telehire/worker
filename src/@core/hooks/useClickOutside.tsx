import { MutableRefObject, useCallback, useEffect, useRef } from 'react'

const defaultEvent = 'click'

type RefType = HTMLElement | (() => HTMLElement | null) | null | undefined

/**
 * const ref = useClickOutside(undefined, () => {
 *  console.log('xxx')
 * })
 */
export default function useClickOutside<T extends HTMLElement = any>(
  dom: RefType = undefined,
  onClickAway: (event: KeyboardEvent) => void,
  eventName: string = defaultEvent
): MutableRefObject<T> {
  const ele = useRef<T>()

  const handler = useCallback(
    (event: any) => {
      const targetElement = typeof dom === 'function' ? dom() : dom
      const el = targetElement || ele.current
      if (!el || el.contains(event?.target) || (event?.composedPath && event.composedPath().includes(el))) {
        return
      }
      onClickAway(event)
    },
    [ele.current, onClickAway, dom]
  )

  useEffect(() => {
    document.addEventListener(eventName, handler, false)
    return () => {
      document.removeEventListener(eventName, handler, false)
    }
  }, [eventName, handler])
  return ele as MutableRefObject<T>
}
