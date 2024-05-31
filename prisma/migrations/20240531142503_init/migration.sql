-- DropForeignKey
ALTER TABLE "BorrowedBook" DROP CONSTRAINT "BorrowedBook_bookCode_fkey";

-- DropForeignKey
ALTER TABLE "BorrowedBook" DROP CONSTRAINT "BorrowedBook_memberCode_fkey";

-- AddForeignKey
ALTER TABLE "BorrowedBook" ADD CONSTRAINT "BorrowedBook_bookCode_fkey" FOREIGN KEY ("bookCode") REFERENCES "Book"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedBook" ADD CONSTRAINT "BorrowedBook_memberCode_fkey" FOREIGN KEY ("memberCode") REFERENCES "Member"("code") ON DELETE CASCADE ON UPDATE CASCADE;
