import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { seedDatabase } from './jobs/seedData.js';
import { Doctor } from './models/Doctor.js';

async function bootstrap() {
  try {
    console.log(`[Genova Server] Initializing on Node.js ${process.version}...`);
    await connectDatabase();

    // Auto-seed if doctors collection is empty
    const docCount = await Doctor.countDocuments();
    if (docCount === 0) {
      console.log('[Genova Server] Doctors collection is empty. Running initial database seed...');
      await seedDatabase();
    }

    const server = app.listen(env.PORT, () => {
      console.log(`=======================================================`);
      console.log(`  Genova Healthcare OS Backend is listening on port ${env.PORT}`);
      console.log(`  Environment: ${env.NODE_ENV}`);
      console.log(`  Health Check: http://localhost:${env.PORT}/api/health`);
      console.log(`  AI Provider: ${env.AI_API_KEY ? env.AI_PROVIDER : 'Clinical NLP Fallback'}`);
      console.log(`=======================================================`);
    });

    const shutdown = async () => {
      console.log('\n[Genova Server] Shutting down gracefully...');
      server.close(async () => {
        await disconnectDatabase();
        console.log('[Genova Server] Disconnected and closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Genova Server] Fatal startup failure:', error);
    process.exit(1);
  }
}

bootstrap();
