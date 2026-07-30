// KILL-SWITCH SERVICE WORKER
//
// Попередня версія сайту (до 2026-07-30) реєструвала SW `uzor-v2.3.9` з
// cache-first для картинок. Нова версія SW не використовує взагалі — але сама
// реєстрація в браузерах відвідувачів нікуди не зникає: вона й далі
// перехоплювала б запити й віддавала старі закешовані ассети.
//
// Тому файл лишається на тому самому шляху (/service-worker.js), і браузер
// підтягує його при наступній навігації як оновлення. Цей SW нічого не кешує:
// він чистить усі кеші, знімає реєстрацію з себе й перезавантажує відкриті
// вкладки — після чого сайт працює як звичайна статика.
//
// ВИДАЛИТИ цей файл можна десь через рік, коли він відпрацює у всіх, хто
// заходив на стару версію. Видалити раніше = лишити старий SW жити вічно.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.map((n) => caches.delete(n)))
    await self.registration.unregister()
    const clients = await self.clients.matchAll({ type: 'window' })
    for (const client of clients) client.navigate(client.url)
  })())
})
