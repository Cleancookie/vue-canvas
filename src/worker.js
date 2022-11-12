import { compress, decompress } from 'brotli-unicode';

// setInterval(() => {
//   postMessage({ type: 'test' });
// }, 3000);

self.addEventListener('message', async function (e) {
  // Send the message back.
  if (e.data.type === 'test') {
    console.log('worker: test received');
  } else if (e.data.type === 'compress') {
    console.log('worker: compressing')
    const stuffs = await compress(e.data.value);
    this.self.postMessage({ type: 'compressed', value: stuffs });
  } else if (e.data.type === 'decompress') {
    console.log('worker: decompressing')
    const stuffs = await decompress(e.data.value);
    this.self.postMessage({ type: 'decompressed', value: stuffs });
  }
}, false);