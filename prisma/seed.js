import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';

const prisma = new PrismaClient();

const sampleEntries = [
  { daysAgo: 0, weight: 181.2, note: 'Felt rested and hydrated.' },
  { daysAgo: 1, weight: 181.8, note: 'Late dinner last night.' },
  { daysAgo: 2, weight: 182.1, note: 'Solid workout day.' },
  { daysAgo: 3, weight: 182.6, note: 'Busy day, less water.' },
  { daysAgo: 4, weight: 183.0, note: 'Weekend brunch.' },
];

async function main() {
  const count = await prisma.weightEntry.count();
  if (count > 0) return;

  await prisma.weightEntry.createMany({
    data: sampleEntries.map((entry) => ({
      date: subDays(new Date(), entry.daysAgo),
      weight: entry.weight,
      note: entry.note,
    })),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
