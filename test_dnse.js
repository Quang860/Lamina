import https from 'https';

https.get('https://services.entrade.com.vn/chart-api/v2/ohlcs/stock?resolution=D&symbol=HPG&from=1704067200&to=1712534400', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('DNSE:', data.substring(0, 200)));
});
