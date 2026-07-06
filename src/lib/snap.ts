const CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY ?? 'SB-Mid-client-xxxx'

export function loadSnap(): Promise<void> {
  return new Promise((resolve) => {
    if (window.snap) return resolve()
    const s = document.createElement('script')
    s.src = `https://app.sandbox.midtrans.com/snap/snap.js`
    s.setAttribute('data-client-key', CLIENT_KEY)
    s.onload = () => resolve()
    document.head.appendChild(s)
  })
}

export function paySnap(snapToken: string): Promise<'success' | 'pending' | 'error'> {
  return new Promise((resolve) => {
    loadSnap().then(() => {
      if (!window.snap) return resolve('error')
      window.snap.pay(snapToken, {
        onSuccess: () => resolve('success'),
        onPending: () => resolve('pending'),
        onError: () => resolve('error'),
        onClose: () => resolve('pending'),
      })
    })
  })
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, opts: {
        onSuccess?: () => void
        onPending?: () => void
        onError?: () => void
        onClose?: () => void
      }) => void
    }
  }
}
