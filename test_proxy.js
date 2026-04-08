import https from 'https';

const url = 'https://finfo-api.vndirect.com.vn/v4/stock_prices?sort=date&q=code:HPG~date:gte:2024-01-01&size=200';
const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);

https.get(proxyUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('AllOrigins:', data.substring(0, 200)));
});
