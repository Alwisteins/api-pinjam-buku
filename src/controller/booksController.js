import booksModel from "../model/booksModel.js";
import membersModel from "../model/membersModel.js";

const borrowBook = async (req, res) => {
  try {
    const { bookName, member } = req.body;

    // 1). Validate req body
    if (!bookName || !member || !member.name || !member.code) {
      return res
        .status(400)
        .json({ message: "Please provide the required data" });
    }

    // 2). Validate member
    const isMemberExist = await membersModel.getMemberByName(member);
    if (!isMemberExist) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Check if member is penalized
    if (
      isMemberExist.penalty &&
      new Date() < new Date(isMemberExist.penaltyEndDate)
    ) {
      return res.status(403).json({
        message: "Member is currently penalized and cannot borrow books",
      });
    }

    if (isMemberExist.borrowedBooks.length >= 2) {
      return res.status(403).json({
        message: "Member has reached the maximum limit for borrowing books",
      });
    }

    // 3). Validate book
    const isBookExist = await booksModel.getBookByName(bookName);
    if (!isBookExist) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (isBookExist.stock < 1) {
      return res
        .status(404)
        .json({ message: "Book was borrowed by other member" });
    }

    // 4). Perform borrow transaction
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

    // 1). Validate req body
    if (!bookName || !member || !member.name || !member.code) {
      return res
        .status(400)
        .json({ message: "Please provide the required data" });
    }

    // 2). Validate member
    const isMemberExist = await membersModel.getMemberByName(member);
    if (!isMemberExist) {
      return res.status(404).json({ message: "Member not found" });
    }

    // 3). Validate book
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

    const data = await booksModel.returnBook(isMemberExist, isBookExist);

    return data.updatedMember.penalty
      ? res.status(401).json({
          message: "You will be penalized for returning books more than 7 days",
          data,
        })
      : res.status(200).json({ message: "Book has been successfully returned", data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error on server side" });
  }
};


const booksController = { borrowBook, returnBook };
export default booksController;
