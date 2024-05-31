import booksModel from "../model/booksModel.js";
import membersModel from "../model/membersModel.js";

const borrowBook = async (req, res) => {
  try {
    const { bookName, member } = req.body;

    // 1). validate req body
    if (!bookName || !member || !member.name || !member.code) {
      return res
        .status(400)
        .json({ message: "Please provide the required data" });
    }

    // 2). validate member
    const isMemberExist = await membersModel.getMemberByName(member);
    if (!isMemberExist) {
      return res.status(404).json({ message: "Member not found" });
    }
    if (isMemberExist.borrowedBooks.length >= 2) {
      return res.status(403).json({
        message: "Member has reached the maximum limit for borrowing books",
      });
    }

    // 3). validate book
    const isBookExist = await booksModel.getBookByName(bookName);
    if (!isBookExist) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (isBookExist.stock < 1) {
      return res
        .status(404)
        .json({ message: "Book was borrowed by other member" });
    }

    // 4). perform borrow transaction
    const data = await booksModel.borrowBook(isBookExist, isMemberExist);

    res.status(200).json({ message: "Successfully borrowed a book", data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error on server side" });
  }
};

const returnBook = async (req, res) => {
  try {
    const { bookName, member } = req.body;

    // 1). validate req body
    if (!bookName || !member || !member.name || !member.code) {
      return res
        .status(400)
        .json({ message: "Please provide the required data" });
    }

    // 2). validate member
    const isMemberExist = await membersModel.getMemberByName(member);
    if (!isMemberExist) {
      return res.status(404).json({ message: "Member not found" });
    }

    // 3). validate book
    const isBookExist = await booksModel.getBookByName(bookName);
    if (!isBookExist) {
      return res.status(404).json({ message: "Book not found" });
    }

    const borrowedBooks = isMemberExist.borrowedBooks;

    // Validate return book name
    const isReturnedBookValid = borrowedBooks.filter(
      (book) => book.bookCode === isBookExist.code
    );

    if (isReturnedBookValid.length === 0) {
      return res
        .status(404)
        .json({ message: "Please return the borrowed books correctly" });
    }

    // validate return deadline
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const isBookReturnedInAWeek =
      new Date() - new Date(borrowedBooks[0].borrowedAt) <=
      oneWeekInMilliseconds;

    if (!isBookReturnedInAWeek) {
      await membersModel.updateMemberByName(member.name, { pinalty: true });
    }

    const data = await booksModel.returnBook(isMemberExist, isBookExist);

    return !isBookReturnedInAWeek
      ? res.status(401).json({
          message: "You will be penalized for returning books more than 7 days",
          data,
        })
      : res
          .status(401)
          .json({ message: "book has been successfully returned", data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error on server side" });
  }
};

const booksController = { borrowBook, returnBook };
export default booksController;
