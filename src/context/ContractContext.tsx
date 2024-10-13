import { createContext, useContext } from "react";
import { Contract } from "ethers"; // Assuming you're using ethers.js, adjust as needed

interface ContractContextProps {
  contract: Contract | null;
}

const ContractContext = createContext<ContractContextProps>({
  contract: null,
});

export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({
  children,
  contract,
}: {
  children: React.ReactNode;
  contract: Contract | null;
}) => {
  return (
    <ContractContext.Provider value={{ contract }}>
      {children}
    </ContractContext.Provider>
  );
};
