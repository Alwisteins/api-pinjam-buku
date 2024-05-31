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

    // 4) Check if book is returned after more than 7 days
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const isMemberPenalty =
      new Date() - new Date(borrowedBook.borrowedAt) <= oneWeekInMilliseconds;

    // 5) Update member with penalty if book is returned late
    const penaltyEndDate = !isMemberPenalty
      ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      : null;

    // get the updated member
    const updatedMember = await trx.member.update({
      where: { code: isMemberExist.code },
      data: {
        penalty: !isMemberPenalty,
        penaltyEndDate: penaltyEndDate,
      },
      include: { borrowedBooks: true },
    });

    return { updatedBook, updatedMember };
  });
};

const getAvailableBooks = () => {
  return prisma.book.findMany({ where: { stock: { gte: 0 } } });
};

const booksModel = { getBookByName, borrowBook, returnBook, getAvailableBooks };
export default booksModel;
