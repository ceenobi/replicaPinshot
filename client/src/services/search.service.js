import { connect, authHeader } from "@config";

const searchUserOrPin = async (searchQuery) => {
  return await connect.get(`/search/?q=${searchQuery}`);
};

const getAllTags = async () => {
  return await connect.get("/search/tags");
};

export default { searchUserOrPin, getAllTags };
