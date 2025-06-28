import { Prisma } from '@prisma/client';

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}; 