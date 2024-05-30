import prisma from "../config/database.js";

const getMemberByName = (member) => {
  const { name, code } = member;
  return prisma.member.findUnique({
    where: { name, code },
    include: { borrowedBooks: true },
  });
};

const membersModel = { getMemberByName };
export default membersModel;
