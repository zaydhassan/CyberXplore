import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import FileModel from '../models/File';
import { enqueue } from '../queue';

const router = Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if(['.pdf','.docx','.jpg','.png'].includes(ext)) cb(null, true);
    else cb(new Error('File type not allowed'));
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;
  if(!file) return res.status(400).json({ error: 'No file uploaded' });

  const newFile = await FileModel.create({
    filename: file.originalname,
    path: file.path,
    status: 'pending',
    uploadedAt: new Date(),
    scannedAt: null,
    result: null,
  });

  enqueue({ fileId: newFile._id.toString(), path: file.path });
  res.status(201).json({ message: 'File uploaded', fileId: newFile._id });
});

export default router;
