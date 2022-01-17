import React, { FC, useState, createContext } from 'react';
interface ISidebarContext {
	sidebarToggle: any;
	toggleSidebar: () => void;
}

const initSideBarContext: ISidebarContext = {
	sidebarToggle: false,
	toggleSidebar: () => false,
};

export const SidebarContext = createContext<ISidebarContext>(initSideBarContext);

export const SidebarProvider: FC = ({ children }) => {
	const [sidebarToggle, setSidebarToggle] = useState(false);
	const toggleSidebar = () => {
		setSidebarToggle(!sidebarToggle);
	};

	return (
		<SidebarContext.Provider value={{ sidebarToggle, toggleSidebar }}>
			{children}
		</SidebarContext.Provider>
	);
};
