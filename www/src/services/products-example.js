import createCRUDOperations from "../utils/crud";

const baseURL = "/api/products";

const productAPI = createCRUDOperations(baseURL);

export const getProducts = productAPI.getAll;
export const getProductById = productAPI.getById;
export const createProduct = productAPI.create;
export const updateProduct = productAPI.update;
export const deleteProduct = productAPI.delete;
