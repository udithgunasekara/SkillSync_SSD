import React, { createContext, useContext, useState, ReactNode } from 'react';


//This is the page that handle the context of the qualificaiton docs
interface SocialLinks {
  linkedIn: string;
  behance: string;
  portfolio: string;
}

interface Qualification {
  title: string;
  startDate: string;
  endDate: string;
  image: File[];
}

interface QualificationsContextType {
  qualifications: Qualification[];
  setQualifications: React.Dispatch<React.SetStateAction<Qualification[]>>;
  socialLinks: SocialLinks;
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinks>>;
}

// Providing an initial value with the correct type
const QualificationsContext = createContext<QualificationsContextType | undefined>(undefined);

export const useQualifications = () => {
  const context = useContext(QualificationsContext);
  if (context === undefined) {
    throw new Error('useQualifications must be used within a QualificationsProvider');
  }
  return context;
};

interface QualificationsProviderProps {
  children: ReactNode; // Properly typing 'children'
}

export const QualificationsProvider: React.FC<QualificationsProviderProps> = ({ children }) => {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ linkedIn: '', behance: '', portfolio: '' });

  return (
    <QualificationsContext.Provider value={{ qualifications, setQualifications, socialLinks, setSocialLinks }}>
      {children}
    </QualificationsContext.Provider>
  );
};

