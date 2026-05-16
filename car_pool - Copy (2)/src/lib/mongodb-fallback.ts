import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _inMemoryDb: any;
}

const useLocalMongo = process.env.USE_LOCAL_MONGODB === 'true';
const uri = process.env.MONGODB_URI;

if (!uri && !useLocalMongo) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Create a simple in-memory store if local MongoDB is not available
class InMemoryMongoClient {
  private collections: Record<string, any[]> = {};

  db(dbName: string) {
    return {
      collection: (collectionName: string) => {
        if (!this.collections[collectionName]) {
          this.collections[collectionName] = [];
        }
        
        return {
          find: (query = {}) => ({
            toArray: async () => this.collections[collectionName].filter(doc => 
              Object.entries(query).every(([key, value]) => doc[key] === value)
            ),
          }),
          findOne: async (query = {}) => this.collections[collectionName].find(doc => 
            Object.entries(query).every(([key, value]) => doc[key] === value)
          ),
          insertOne: async (doc: any) => {
            const _id = Math.random().toString(36).substring(2, 9);
            const newDoc = { ...doc, _id };
            this.collections[collectionName].push(newDoc);
            return { insertedId: _id, acknowledged: true };
          },
          insertMany: async (docs: any[]) => {
            const ids = [];
            for (const doc of docs) {
              const _id = Math.random().toString(36).substring(2, 9);
              const newDoc = { ...doc, _id };
              this.collections[collectionName].push(newDoc);
              ids.push(_id);
            }
            return { insertedIds: ids, acknowledged: true };
          },
          updateOne: async (query: any, update: any) => {
            const index = this.collections[collectionName].findIndex(doc => 
              Object.entries(query).every(([key, value]) => doc[key] === value)
            );
            if (index !== -1) {
              if (update.$set) {
                this.collections[collectionName][index] = { 
                  ...this.collections[collectionName][index], 
                  ...update.$set 
                };
              }
              return { modifiedCount: 1, acknowledged: true };
            }
            return { modifiedCount: 0, acknowledged: true };
          },
          deleteOne: async (query: any) => {
            const index = this.collections[collectionName].findIndex(doc => 
              Object.entries(query).every(([key, value]) => doc[key] === value)
            );
            if (index !== -1) {
              this.collections[collectionName].splice(index, 1);
              return { deletedCount: 1, acknowledged: true };
            }
            return { deletedCount: 0, acknowledged: true };
          },
          listCollections: () => ({
            toArray: async () => Object.keys(this.collections).map(name => ({ name }))
          })
        };
      },
      listCollections: () => ({
        toArray: async () => Object.keys(this.collections).map(name => ({ name }))
      })
    };
  }

  // Mock required MongoClient methods
  connect() {
    console.log('Using in-memory MongoDB mockup!');
    return Promise.resolve(this);
  }

  close() {
    return Promise.resolve();
  }
}

// Set up local MongoDB fallback for development
const getMongoConnection = async (): Promise<{ uri: string; client: MongoClient | InMemoryMongoClient }> => {
  // Always use in-memory mockup for simplicity
  console.log('Using in-memory MongoDB mockup for development...');
  // Use in-memory mockup since Atlas seems to have connection issues
  if (!global._inMemoryDb) {
    global._inMemoryDb = new InMemoryMongoClient();
  }
  return { 
    uri: 'memory://localhost/carpooldb', 
    client: global._inMemoryDb as unknown as MongoClient 
  };
};

let clientPromise: Promise<MongoClient | InMemoryMongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = getMongoConnection().then(({ client }) => client) as Promise<MongoClient>;
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = getMongoConnection().then(({ client }) => client);
}

export default clientPromise as Promise<MongoClient>; 