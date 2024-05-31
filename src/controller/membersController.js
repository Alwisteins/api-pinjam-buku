import membersModel from "../model/membersModel.js";

const getAllMembers = async (req, res) => {
  try {
    const data = await membersModel.getAllMembers();
    if (data.length === 0) {
      return res.status(404).json({ message: "there's no member to show" });
    }

    return res
      .status(200)
      .json({ message: "successfully get all member list", data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error on server side" });
  }
};

const membersController = { getAllMembers };
export default membersController;
