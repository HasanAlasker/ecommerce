import usersModel from "../models/usersModel.js";
import bcrypt from 'bcrypt'

export const register = async ({
  fullName,
  email,
  password,
  phone,
  address,
}) => {
  const findUser = await usersModel.findOne({ email });

  if (findUser) {
    return { data: "User already exists", statusCode:400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new usersModel({ fullName, email, password:hashedPassword, phone, address });
  await newUser.save();

  return {data: newUser, statusCode:200};
};

export const login = async ({ email, password }) => {
  const findUser = await usersModel.findOne({ email });

  if (!findUser) {
    return { data:"User doesn't exist", statusCode:200 };
  }

  const passwordMatch = await bcrypt.compare(password, findUser.password);

  if (!passwordMatch) {
    return { data: "Incorrect email or password" , statusCode:400 };
  }

  return {data: findUser, statusCode:200};
};
