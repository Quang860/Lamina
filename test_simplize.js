import https from 'https';

https.get('https://api.simplize.vn/api/historical/quotes/historical?symbol=HPG&type=history&range=6m', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Simplize:', data.substring(0, 200)));
});
