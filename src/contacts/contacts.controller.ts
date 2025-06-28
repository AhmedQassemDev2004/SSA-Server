import { Controller, Get, Post, Body, Param, UseGuards, NotFoundException, Res } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './contacts.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';
import { Response } from 'express';
import { Parser } from 'json2csv';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Public()
  async create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Contact[]> {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const contact = await this.contactsService.findOne(+id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return contact;
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  async export(@Res() res: Response) {
    const contacts = await this.contactsService.findAll();
    
    const fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'createdAt', 'updatedAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(contacts);

    res.header('Content-Type', 'text/csv');
    res.attachment('contacts.csv');
    return res.send(csv);
  }
} 