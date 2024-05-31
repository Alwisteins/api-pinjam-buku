import prisma from "../config/database.js";

const getBookByName = (bookName) => {
  return prisma.book.findUnique({
    where: { title: bookName },
    include: { borrowedBy: true },
  });
};

const borrowBook = (book, member) => {
  return prisma.$transaction(async (trx) => {
    // 1) update book, change the stock & borrowedBy
    const updatedBook = await trx.book.update({
      where: { title: book.title },
      data: { stock: { decrement: 1 } },
      include: { borrowedBy: true },
    });

    // 2) create borrowed book entry
    const borrowedBook = await trx.borrowedBook.create({
      data: {
        borrowedAt: new Date(),
        book: { connect: { code: book.code } },
        member: { connect: { code: member.code } },
      },
    });

    // 1) update member, change the borrowedBooks
    const updatedMember = await trx.member.update({
      where: { code: member.code },
      data: { borrowedBooks: { connect: { id: borrowedBook.id } } },
      include: { borrowedBooks: true },
    });

    return { updatedBook, updatedMember };
  });
};

const booksModel = { getBookByName, borrowBook };
export default booksModel;
