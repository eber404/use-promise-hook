import { useCallback, useEffect, useRef, useState } from 'react'

type PromiseCallback<T> = () => Promise<T>

type Status = 'idle' | 'pending' | 'resolved' | 'rejected'

export function usePromise<T>(promiseCallback: PromiseCallback<T>) {
  const [data, setData] = useState<T>()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string>()
  const promiseRef = useRef<() => Promise<T>>()

  const isIdle = status === 'idle'
  const isLoading = status === 'pending'
  const isSuccess = status === 'resolved'
  const isError = status === 'rejected'

  const resolve = useCallback(async () => {
    try {
      if (!promiseRef.current) return
      setStatus('pending')
      setData(undefined)
      const data = await promiseRef.current()
      setData(data)
      setStatus('resolved')
    } catch (error: any) {
      setError(String(error?.message ?? error))
      setStatus('rejected')
    }
  }, [])

  useEffect(() => {
    promiseRef.current = promiseCallback
  }, [promiseCallback])

  return {
    resolve,
    data,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    error,
  }
}
