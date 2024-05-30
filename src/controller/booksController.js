import booksModel from "../model/booksModel.js";
import membersModel from "../model/membersModel.js";

const borrow = async (req, res) => {
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
    const book = await booksModel.getBookByName(bookName);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.stock < 1) {
      return res
        .status(404)
        .json({ message: "Book was borrowed by other member" });
    }

    // 4). perform borrow transaction
    const data = await booksModel.borrow(book, isMemberExist);

    res.status(200).json({ message: "Successfully borrowed a book", data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
};

const booksController = { borrow };
export default booksController;
