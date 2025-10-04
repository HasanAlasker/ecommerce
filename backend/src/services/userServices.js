import("dotenv/config");
import usersModel from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUsers = async () => {
  return await usersModel.find();
};

// For user to edit his profile
export const editUser = async ({ id, data }) => {
  try {
    const updatedUser = await usersModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new Error("user not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to edit user: ${error.message}`);
  }
};

// For user to delete his account
export const deleteUser = async ({ id }) => {
  try {
    const deletedUser = await usersModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error("user not found");
    }

    return deletedUser;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

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
    // role will use default 'user' from schema
  });

  const savedUser = await newUser.save();

  // Create user object without password - INCLUDE ROLE
  const userResponse = {
    id: savedUser._id,
    fullName: savedUser.fullName,
    email: savedUser.email,
    phone: savedUser.phone,
    address: savedUser.address,
    role: savedUser.role, // ADD THIS LINE
  };

  return {
    data: generateJWT({
      id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      role: savedUser.role, // ADD ROLE TO JWT
    }),
    user: userResponse,
    statusCode: 200,
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

  // Create user object without password - INCLUDE ROLE
  const userResponse = {
    id: findUser._id,
    fullName: findUser.fullName,
    email: findUser.email,
    phone: findUser.phone,
    address: findUser.address,
    role: findUser.role, // ADD THIS LINE
  };

  return {
    data: generateJWT({
      id: findUser._id,
      fullName: findUser.fullName,
      email: findUser.email,
      role: findUser.role, // ADD ROLE TO JWT
    }),
    user: userResponse,
    statusCode: 200,
  };
};

const generateJWT = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};
