import prisma from "../config/database.js";

const getMemberByName = (memberName) => {
  return prisma.member.findUnique({
    where: { name: memberName },
    include: { borrowedBooks: true },
  });
};

const membersModel = { getMemberByName };
export default membersModel;
