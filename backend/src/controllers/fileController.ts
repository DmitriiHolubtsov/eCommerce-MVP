import { Request, Response } from 'express';

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;
  res.status(201).json({ url: fileUrl });
};

export const getFile = async (req: Request, res: Response) => {
  const { filename } = req.params;
  res.sendFile(filename, { root: 'uploads' });
};
