import productModel from "../models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const addProduct = async ({ name, image, price, stock }) => {
  try {
    const newProduct = new productModel({ name, image, price, stock });
    return await newProduct.save();
  } catch (error) {
    throw new Error(`Failed to add product: ${error.message}`);
  }
};

export const editProduct = async ({ id, data }) => {
  try {
    const updatedProcuct = await productModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedProcuct) {
      throw new Error("Product not found");
    }

    return updatedProcuct;
  } catch (error) {
    throw new Error(`Failed to add product: ${error.message}`);
  }
};

export const deleteProduct = async ({ id }) => {
  try {
    const deletedProcuct = await productModel.findByIdAndDelete(id);

    if (!deleteProduct) {
      throw new Error("Product not found");
    }

    return deleteProduct;
  } catch (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
};

export const findProduct = async ({ id }) => {
  try {
    const foundProduct = await productModel.findById(id);

    if (!foundProduct) {
      throw new Error("Product not found");
    }

    return foundProduct;
  } catch (error) {
    throw new Error(`Failed to get product: ${error.message}`);
  }
};
