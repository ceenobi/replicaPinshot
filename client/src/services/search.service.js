import { connect, authHeader } from "@config";

const searchUserOrPin = async (searchQuery) => {
  return await connect.get(`/search/?q=${searchQuery}`);
};

const getAllTags = async () => {
  return await connect.get("/search/tags");
};

const deleteATag = async (pinId, index) => {
  return await connect.delete(`/search/${pinId}/tags/${index}`, {
    headers: authHeader(),
  });
};

export default { searchUserOrPin, getAllTags, deleteATag };
