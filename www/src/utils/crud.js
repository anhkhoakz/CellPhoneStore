import http from "./axios";

const createCRUDOperations = (baseURL) => ({
	getAll: async () => {
		try {
			const response = await http.get(baseURL);
			return response.data;
		} catch (error) {
			console.error(`Error fetching all from ${baseURL}:`, error);
			throw new Error("Failed to fetch data");
		}
	},

	getById: async (id) => {
		try {
			const response = await http.get(`${baseURL}/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching ${id} from ${baseURL}:`, error);
			throw new Error(`Failed to fetch resource with ID ${id}`);
		}
	},

	create: async (data) => {
		try {
			const response = await http.post(baseURL, data);
			return response.data;
		} catch (error) {
			console.error("Error creating resource:", error);
			throw new Error("Failed to create resource");
		}
	},

	update: async (id, data) => {
		try {
			const response = await http.put(`${baseURL}/${id}`, data);
			return response.data;
		} catch (error) {
			console.error(`Error updating ${id} on ${baseURL}:`, error);
			throw new Error(`Failed to update resource with ID ${id}`);
		}
	},

	delete: async (id) => {
		try {
			const response = await http.delete(`${baseURL}/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error deleting ${id} from ${baseURL}:`, error);
			throw new Error(`Failed to delete resource with ID ${id}`);
		}
	},
});

export default createCRUDOperations;
