import { loadData } from './lib/loadData.js';

(async () => {
  const data = await loadData();
  console.log(data);
})();