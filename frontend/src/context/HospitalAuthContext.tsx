import React, { createContext, useContext, useState, useEffect } from "react";

// Define blood availability types
export type BloodAvailability = {
    "A+": number;
    "A-": number;
    "B+": number;
    "B-": number;
    "AB+": number;
    "AB-": number;
    "O+": number;
    "O-": number;
};

// Hospital interface
export interface Hospital {
    _id: string;
    name: string;
    email: string;
    location: string;
    phone: string;
    bloodAvailability: BloodAvailability;
}

type HospitalAuthContextType = {
    hospital: Hospital | null;
    loginHospital: (hospitalData: Hospital) => void;
    logoutHospital: () => void;
};

const HospitalAuthContext = createContext<HospitalAuthContextType>({
    hospital: null,
    loginHospital: () => { },
    logoutHospital: () => { },
});

export const useHospitalAuth = () => useContext(HospitalAuthContext);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hospital, setHospital] = useState<Hospital | null>(null);

    // Load hospital from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("hospital");
        if (stored) {
            setHospital(JSON.parse(stored));
        }
    }, []);

    // Login hospital and persist
    const loginHospital = (hospitalData: Hospital) => {
        localStorage.setItem("hospital", JSON.stringify(hospitalData));
        setHospital(hospitalData);
    };

    // Logout hospital
    const logoutHospital = () => {
        localStorage.removeItem("hospital");
        setHospital(null);
    };

    return (
        <HospitalAuthContext.Provider value={{ hospital, loginHospital, logoutHospital }}>
            {children}
        </HospitalAuthContext.Provider>
    );
}; 