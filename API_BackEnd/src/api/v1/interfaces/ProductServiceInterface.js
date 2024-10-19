/**
 * @typedef {Object} ProductServiceInterface
 * @property {function(): Promise<Array>} getProducts
 * @property {function(string): Promise<Object>} getProductById
 * @property {function(Object): Promise<Object>} createProduct
 * @property {function(string, Object): Promise<Object>} updateProduct
 * @property {function(string): Promise<void>} deleteProduct
 */
