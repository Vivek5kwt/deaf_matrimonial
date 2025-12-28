import React, { createContext, useState, useContext } from 'react';

const ActiveIconContext = createContext();

export const ActiveIconProvider = ({ children }) => {
    const [activeIcon, setActiveIcon] = useState('home');

    return (
        <ActiveIconContext.Provider value={{ activeIcon, setActiveIcon }}>
            {children}
        </ActiveIconContext.Provider>
    );
};

export const useActiveIcon = () => {
    const context = useContext(ActiveIconContext);
    if (!context) {
        throw new Error('useActiveIcon must be used within an ActiveIconProvider');
    }
    return context;
};
