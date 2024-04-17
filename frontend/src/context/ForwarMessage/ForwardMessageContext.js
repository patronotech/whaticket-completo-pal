import React, { useState, createContext } from "react";

const ForwardMessageContext = createContext();

const ForwardMessageProvider = ({ children }) => {
	const [showSelectMessageCheckbox, setShowSelectMessageCheckbox] = useState(false);
	const [selectedMessages, setSelectedMessages] = useState([]);
	const [forwardMessageModalOpen, setForwardMessageModalOpen] = useState(false);
	return (
		<ForwardMessageContext.Provider
			value={{
				showSelectMessageCheckbox, setShowSelectMessageCheckbox,
				selectedMessages, setSelectedMessages,
				forwardMessageModalOpen, setForwardMessageModalOpen
			}}
		>
			{children}
		</ForwardMessageContext.Provider>
	);
};

export { ForwardMessageContext, ForwardMessageProvider };
