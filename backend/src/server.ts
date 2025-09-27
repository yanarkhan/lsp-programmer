import { buatApp } from './app';
import { env } from './config/env';

const app = buatApp();
app.listen(env.port, () => {
  console.log(`Server jalan di http://localhost:${env.port}`);
});
