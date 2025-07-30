import { Router } from 'express';
import FileModel from '../models/File';

const router = Router();

router.get('/', async (req, res) => {
  const files = await FileModel.find().sort({ uploadedAt: -1 });
  res.json(files);
});

export default router;
