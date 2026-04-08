import https from 'https';

const testProxy = (proxyUrl, name) => {
  https.get(proxyUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`${name} (${res.statusCode}):`, data.substring(0, 200)));
  }).on('error', e => console.error(`${name} Error:`, e.message));
};

testProxy('https://api.simplize.vn/api/company/historical-quote/HPG', 'Simplize');
testProxy('https://fwtapi1.fialda.com/api/services/app/StockInfo/GetHistoricalQuotes?symbol=HPG', 'Fialda');
testProxy('https://s.cafef.vn/Ajax/Chart/ChartData.ashx?symbol=HPG&date1=2024-01-01&date2=2024-04-08', 'CafeF');
