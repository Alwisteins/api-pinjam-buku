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

    // 3) update member, change the borrowedBooks
    const updatedMember = await trx.member.update({
      where: { code: member.code },
      data: { borrowedBooks: { connect: { id: borrowedBook.id } } },
      include: { borrowedBooks: true },
    });

    return { updatedBook, updatedMember };
  });
};

const returnBook = async (isMemberExist, isBookExist) => {
  return prisma.$transaction(async (trx) => {
    // 1) Get the borrowed book entry
    const borrowedBook = await trx.borrowedBook.findFirst({
      where: {
        bookCode: isBookExist.code,
        memberCode: isMemberExist.code,
      },
    });

    // 2) Delete the borrowed book record
    await trx.borrowedBook.delete({ where: { id: borrowedBook.id } });

    // 3) Update book, increment the stock
    const updatedBook = await trx.book.update({
      where: { title: isBookExist.title },
      data: { stock: { increment: 1 } },
    });

    // get the updated member
    const updatedMember = await trx.member.findUnique({
      where: { code: isMemberExist.code },
      include: { borrowedBooks: true },
    });

    return { updatedBook, updatedMember };
  });
};

const booksModel = { getBookByName, borrowBook, returnBook };
export default booksModel;
