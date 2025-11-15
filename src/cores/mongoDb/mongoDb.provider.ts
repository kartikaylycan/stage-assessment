import mongoose from 'mongoose';

const mongoDbConnectionConfig = [
  {
    provide: 'MONGODB_CONNECTION',
    uri: process.env.MONGODB_URI || '',
    option: {
      timeoutMS: 5000,
      maxPoolSize: 50,
      minPoolSize: 5,
      dbName: process.env.MONGODB_DB_NAME,
    },
  },
];

export async function createMongoDbConnections(
  uri: string,
  option: mongoose.ConnectOptions,
): Promise<mongoose.Connection> {
  if (!uri) {
    throw new Error('MongoDB URI is not provided');
  }

  const connection = mongoose.createConnection(uri, option);
  connection.on('connected', () =>
    console.log(`MongoDB connected to \`${option.dbName}\``),
  );
  connection.on('error', (err) =>
    console.log(`MongoDB connection error with \`${option.dbName}\``, err),
  );
  connection.on('disconnected', () =>
    console.log(`MongoDB disconnected from \`${option.dbName}\``),
  );

  await connection.asPromise();
  return connection;
}

export const mongoDbProvider = mongoDbConnectionConfig.map((config) => ({
  provide: config.provide,
  useFactory: async () => createMongoDbConnections(config.uri, config.option),
}));
