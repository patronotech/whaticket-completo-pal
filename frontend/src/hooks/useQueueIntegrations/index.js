import api from "../../services/api";

const useQueueIntegrations = () => {
	const findAll = async () => {
        const { data } = await api.get("/queueIntegration/");
        return data;
    }

	return { findAll };
};

export default useQueueIntegrations;