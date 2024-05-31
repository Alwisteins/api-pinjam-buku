import prisma from "../config/database.js";

const getMemberByName = (member) => {
  const { name, code } = member;
  return prisma.member.findUnique({
    where: { name, code },
    include: { borrowedBooks: true },
  });
};

const updateMemberByName = (name, data) => {
  return prisma.member.update({ where: { name }, data });
};

const membersModel = { getMemberByName, updateMemberByName };
export default membersModel;
