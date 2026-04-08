import https from 'https';

const url = 'https://finfo-api.vndirect.com.vn/v4/stock_prices?sort=date&q=code:VNINDEX~date:gte:2024-01-01&size=200';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('VNDirect VNINDEX:', data.substring(0, 200)));
});
