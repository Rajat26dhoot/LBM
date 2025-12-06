import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
    },
  });

  console.log('Created users:', user1.email, user2.email);

  // Create authors
  const author1 = await prisma.author.create({
    data: {
      name: 'J.K. Rowling',
      bio: 'British author, best known for the Harry Potter series',
      birthDate: new Date('1965-07-31'),
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'George R.R. Martin',
      bio: 'American novelist and short story writer, author of A Song of Ice and Fire',
      birthDate: new Date('1948-09-20'),
    },
  });

  const author3 = await prisma.author.create({
    data: {
      name: 'Agatha Christie',
      bio: 'English writer known for her detective novels',
      birthDate: new Date('1890-09-15'),
    },
  });

  console.log('Created authors:', author1.name, author2.name, author3.name);

  // Create books
  const book1 = await prisma.book.create({
    data: {
      title: "Harry Potter and the Philosopher's Stone",
      isbn: '978-0747532699',
      publishedDate: new Date('1997-06-26'),
      description: 'The first book in the Harry Potter series',
      totalCopies: 5,
      availableCopies: 5,
      authorId: author1.id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'Harry Potter and the Chamber of Secrets',
      isbn: '978-0747538493',
      publishedDate: new Date('1998-07-02'),
      description: 'The second book in the Harry Potter series',
      totalCopies: 3,
      availableCopies: 3,
      authorId: author1.id,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'A Game of Thrones',
      isbn: '978-0553103540',
      publishedDate: new Date('1996-08-06'),
      description: 'The first novel in A Song of Ice and Fire series',
      totalCopies: 4,
      availableCopies: 4,
      authorId: author2.id,
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: 'Murder on the Orient Express',
      isbn: '978-0062693662',
      publishedDate: new Date('1934-01-01'),
      description: 'A detective novel featuring Hercule Poirot',
      totalCopies: 2,
      availableCopies: 2,
      authorId: author3.id,
    },
  });

  console.log('Created books:', book1.title, book2.title, book3.title, book4.title);

  // Create a borrowed book
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const borrowedBook = await prisma.borrowedBook.create({
    data: {
      bookId: book1.id,
      userId: user1.id,
      dueDate,
    },
  });

  // Update available copies
  await prisma.book.update({
    where: { id: book1.id },
    data: {
      availableCopies: 4,
    },
  });

  console.log('Created borrowed book for:', user1.name);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });