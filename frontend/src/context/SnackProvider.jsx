import { createContext, useContext, useState, useCallback } from "react";
import SnackBar from "../components/SnackBar";

const SnackContext = createContext();

export const useSnack = () => {
  const context = useContext(SnackContext);
  if (!context) {
    throw new Error("useSnack must be used within SnackProvider");
  }
  return context;
};

let idCounter = 0;

export const SnackProvider = ({ children }) => {
  const [snacks, setSnacks] = useState([]);

  const showSnack = useCallback(({ message, type = "success" }) => {
    const id = idCounter++;
    setSnacks((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeSnack = useCallback((id) => {
    setSnacks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <SnackContext.Provider value={{ showSnack }}>
      {children}

      <div className="fixed top-6 right-6 flex flex-col gap-3 z-[9999] pointer-events-none">
        {snacks.map((snack) => (
          <SnackBar
            key={snack.id}
            message={snack.message}
            type={snack.type}
            onRemove={() => removeSnack(snack.id)}
          />
        ))}
      </div>
    </SnackContext.Provider>
  );
};
