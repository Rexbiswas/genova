import mongoose from 'mongoose';
import { env } from './env.js';

let memoryServerInstance: any = null;

export async function connectDatabase(): Promise<typeof mongoose> {
  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    // Attempt connecting to the configured MongoDB URI
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] Connected successfully to MongoDB at ${env.MONGODB_URI}`);
    return mongoose;
  } catch (error) {
    if (env.USE_MEMORY_DB_IF_UNAVAILABLE || env.NODE_ENV === 'test') {
      console.warn(`[Database] Could not connect to primary MongoDB URI (${(error as Error).message}). Initializing embedded in-memory MongoDB...`);
      try {
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const downloadDir = path.resolve(__dirname, '../../../../.cache/mongodb-binaries');

        if (!fs.existsSync(downloadDir)) {
          fs.mkdirSync(downloadDir, { recursive: true });
        }
        process.env.MONGOMS_DOWNLOAD_DIR = downloadDir;

        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create({
          binary: {
            version: '6.0.14',
            downloadDir,
          },
        });
        const uri = memoryServerInstance.getUri();
        await mongoose.connect(uri);
        console.log(`[Database] Connected to in-memory MongoDB at ${uri}`);
        return mongoose;
      } catch (memErr) {
        console.error('[Database] Failed to start in-memory MongoDB:', memErr);
        throw memErr;
      }
    }
    console.error('[Database] MongoDB connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
  }
}
