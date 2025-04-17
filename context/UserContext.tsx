import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
  level: number;
  addExperience: (points: number) => void;
  timeSpent: {
    learn: number;
    chat: number;
    camera: number;
  };
  updateTimeSpent: (section: 'learn' | 'chat' | 'camera', seconds: number) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('Kaşif');
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [timeSpent, setTimeSpent] = useState({
    learn: 0,
    chat: 0,
    camera: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      const storedLevel = await AsyncStorage.getItem('level');
      const storedExp = await AsyncStorage.getItem('experience');
      const storedTime = await AsyncStorage.getItem('timeSpent');

      if (storedName) setUserName(storedName);
      if (storedLevel) setLevel(Number(storedLevel));
      if (storedExp) setExperience(Number(storedExp));
      if (storedTime) setTimeSpent(JSON.parse(storedTime));
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  };

  const addExperience = async (points: number) => {
    const newExp = experience + points;
    const expNeeded = level * 100;
    
    if (newExp >= expNeeded) {
      setLevel(prev => prev + 1);
      setExperience(newExp - expNeeded);
    } else {
      setExperience(newExp);
    }

    try {
      await AsyncStorage.setItem('level', String(level));
      await AsyncStorage.setItem('experience', String(experience));
    } catch (error) {
      console.error('Deneyim kaydedilirken hata:', error);
    }
  };

  const updateTimeSpent = async (section: 'learn' | 'chat' | 'camera', seconds: number) => {
    setTimeSpent(prev => {
      const newTime = {
        ...prev,
        [section]: prev[section] + seconds
      };
      
      AsyncStorage.setItem('timeSpent', JSON.stringify(newTime))
        .catch(error => console.error('Süre kaydedilirken hata:', error));
      
      return newTime;
    });
  };

  const value = {
    userName,
    setUserName: async (name: string) => {
      setUserName(name);
      try {
        await AsyncStorage.setItem('userName', name);
      } catch (error) {
        console.error('İsim kaydedilirken hata:', error);
      }
    },
    level,
    addExperience,
    timeSpent,
    updateTimeSpent,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}