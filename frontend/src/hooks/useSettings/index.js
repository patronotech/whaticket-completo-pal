import api from "../../services/api";

const useSettings = () => {
  const getAll = async (params) => {
    const { data } = await api.request({
      url: "/settings",
      method: "GET",
      params,
    });
    return data;
  };

  const update = async (data) => {
    const { data: responseData } = await api.request({
      url: `/settings/${data.key}`,
      method: "PUT",
      data,
    });
    return responseData;
  };

  const get = async (param: string) => {
    const { data } = await api.request({
      url: `/setting/${param}`,
      method: "GET",
    });
    return data;
  };

  return {
    getAll,
    update,
    get,
  };
};

export default useSettings;
