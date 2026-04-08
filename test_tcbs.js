import https from 'https';

https.get('https://apipubaws.tcbs.com.vn/stock-insight/v1/stock/bars?ticker=HPG&type=stock&resolution=D&from=1704067200&to=1712534400', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('TCBS Bars:', data.substring(0, 200)));
});
