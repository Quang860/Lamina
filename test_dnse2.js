import https from 'https';

const to = Math.floor(Date.now() / 1000);
const from = to - 180 * 24 * 60 * 60;

https.get(`https://services.entrade.com.vn/chart-api/v2/ohlcs/stock?resolution=D&symbol=HPG&from=${from}&to=${to}`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('DNSE:', data.substring(0, 200)));
});
