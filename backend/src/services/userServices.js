import('dotenv/config');
import usersModel from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async ({
  fullName,
  email,
  password,
  phone,
  address,
}) => {
  const findUser = await usersModel.findOne({ email });

  if (findUser) {
    return { data: "User already exists", statusCode: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new usersModel({
    fullName,
    email,
    password: hashedPassword,
    phone,
    address,
  });
  
  const savedUser = await newUser.save();
  
  // Create user object without password
  const userResponse = {
    id: savedUser._id,
    fullName: savedUser.fullName,
    email: savedUser.email,
    phone: savedUser.phone,
    address: savedUser.address
  };

  return { 
    data: generateJWT({ id: savedUser._id, fullName, email }), 
    user: userResponse,
    statusCode: 200 
  };
};

export const login = async ({ email, password }) => {
  const findUser = await usersModel.findOne({ email });

  if (!findUser) {
    return { data: "User doesn't exist", statusCode: 400 };
  }

  const passwordMatch = await bcrypt.compare(password, findUser.password);

  if (!passwordMatch) {
    return { data: "Incorrect email or password", statusCode: 400 };
  }

  // Create user object without password
  const userResponse = {
    id: findUser._id,
    fullName: findUser.fullName,
    email: findUser.email,
    phone: findUser.phone,
    address: findUser.address
  };

  return {
    data: generateJWT({ id: findUser._id, fullName: findUser.fullName, email }),
    user: userResponse,
    statusCode: 200,
  };
};

const generateJWT = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};