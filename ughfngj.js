const R2_BUCKET = "files";  // R2 Bucket ismi

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  // Eğer list.json'ı istiyorsa
  if (path === '/list.json') {
    try {
      // R2 Bucket'tan dosyaların listesini al
      const list = await getR2FileList()
      return new Response(JSON.stringify(list), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response('Error retrieving file list from R2', { status: 500 })
    }
  }

  return new Response('Not found', { status: 404 })
}

// R2 Bucket'ındaki dosya listesini al
async function getR2FileList() {
  const files = []
  const objects = await R2_BUCKET.list()

  for (const object of objects.objects) {
    files.push(object.key)
  }

  return files
}
