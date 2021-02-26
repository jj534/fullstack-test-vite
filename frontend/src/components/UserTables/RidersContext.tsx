import React, { useState } from 'react';
import { Rider } from '../../types';
import { useReq } from '../../context/req';

type ridersState = {
    getExistingRiders: () => Array<Rider>,
    refreshRiders: () => Promise<Array<Rider>>
};

const initialState: ridersState = {
  getExistingRiders: () => [],
  refreshRiders: async () => [],
};
const RidersContext = React.createContext(initialState);

export const useRiders = () => React.useContext(RidersContext);

type RidesProviderProps = {
  children: React.ReactNode;
}

type RidersType = Array<Rider>;

export const RidesProvider = ({ children }: RidesProviderProps) => {
  const [riders, setRiders] = useState<RidersType>([]);
  const getExistingRiders = () => riders;
  const { withDefaults } = useReq();
  const refreshRiders = useCallback(async () => {
    const ridersData:RidersType = await fetch('/api/riders', withDefaults())
      .then((res) => res.json())
      .then((data) => data.data);

    setRiders((prev) => ({ ...prev, ridersData }));
    return riders;
  });
    // Initialize the data
  React.useEffect(() => {
    refreshRiders();
  }, [refreshRiders, setRiders, withDefaults]);

  return (
      <RidersContext.Provider
        value={{
          getExistingRiders,
          refreshRiders,
        }}
      >
        {children}
      </RidersContext.Provider>
  );
};
