if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistration('/sw.js')
    .then(registration => {
      if (registration?.active) {
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          () => window.location.reload(),
        )
      }
    })

  window.addEventListener('swUpdate', async () => {
    const registration = await navigator.serviceWorker.getRegistration(
      '/sw.js',
    )
    registration?.waiting?.postMessage('skipWaiting')
  })
}
