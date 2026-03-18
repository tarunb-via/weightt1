import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/weights', async (req, res) => {
  try {
    const entries = await prisma.weightEntry.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(entries);
  } catch (error) {
    console.error('Failed to fetch weights', error);
    res.status(500).json({ error: 'Failed to fetch weights' });
  }
});

app.post('/api/weights', async (req, res) => {
  try {
    const { date, weight, note } = req.body;

    if (!date || !weight || Number.isNaN(Number(weight))) {
      return res.status(400).json({ error: 'Date and weight are required.' });
    }

    const entry = await prisma.weightEntry.upsert({
      where: { date: new Date(date) },
      update: { weight: Number(weight), note: note?.trim() || null },
      create: { date: new Date(date), weight: Number(weight), note: note?.trim() || null },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Failed to save weight', error);
    res.status(500).json({ error: 'Failed to save weight' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening');
});
