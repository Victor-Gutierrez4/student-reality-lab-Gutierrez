import { loadData } from './lib/loadData';

(async () => {
  const data = await loadData();
  console.log(data);
})();