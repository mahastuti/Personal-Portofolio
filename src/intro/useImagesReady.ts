import { useEffect, useState } from 'react'

// tunggu semua layer selesai di-decode supaya intro tidak muncul setengah jadi
export function useImagesReady(urls: string[]) {
  const [ready, setReady] = useState(false)
  const key = urls.join('|')

  useEffect(() => {
    let cancelled = false
    const list = key.split('|')
    Promise.all(
      list.map((src) => {
        const img = new Image()
        img.src = src
        return img.decode().catch(() => undefined)
      }),
    ).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [key])

  return ready
}
