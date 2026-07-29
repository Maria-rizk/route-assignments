import { createApp } from './app.bootstrap.js';
import { connectDB, redisconnection } from './DB/index.js';
import { realTimeGateway } from './modules/realtime/index.js';
import { PORT } from './config/config.service.js';

async function start() {
  console.log('Starting server...');

  await connectDB();
  console.log('DB connected');

  await redisconnection();
  console.log('Redis connected');

  const { httpServer } = createApp();

  await realTimeGateway.intializeIo(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start the server:', error);
  process.exit(1);
});
