import booksModel from "../model/booksModel.js";
import membersModel from "../model/membersModel.js";

const borrow = async (req, res) => {
  try {
    const { bookName, memberName } = req.body;

    // 1). validate req body
    if (!bookName || !memberName) {
      return res
        .status(400)
        .json({ message: "Please provide the required data" });
    }

    // 2). validate member
    const member = membersModel.getMemberByName(memberName);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    if (member.borrowedBooks.length >= 2) {
      return res.status(403).json({
        message: "Member has reached the maximum limit for borrowing books",
      });
    }

    // 2). validate book
    const book = booksModel.getBookByName(bookName);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.stock < 1) {
      return res
        .status(404)
        .json({ message: "Book was borrowed by other member" });
    }

    const data = await booksModel.borrow(book, member);

    res.status(200).json({ message: "successfuly borrow a book", data });
  } catch (err) {
    console.log(err);
    res.status(200).json({ err: err.message });
  }
};

const booksController = { borrow };
export default booksController;
