import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const schema = connectionString
    ? (new URL(connectionString).searchParams.get('schema') ?? 'public')
    : 'public';
  const adapter = new PrismaPg(
    { connectionString, connectionTimeoutMillis: 5000 },
    { schema }
  );
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
