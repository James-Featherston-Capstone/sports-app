import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { createContext, useContext, useState, type ReactNode } from "react";

type DialogContextType = {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
};
type DialogOptions = {
  title: string;
  description: string;
  reactChildren: ReactNode;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogOptions>({
    title: "",
    description: "",
    reactChildren: null,
  });
  const openDialog = ({ title, description, reactChildren }: DialogOptions) => {
    setDialogContent({ title, description, reactChildren });
    setIsModalOpen(true);
  };
  const closeDialog = () => {
    setIsModalOpen(false);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white text-black flex flex-col items-center min-h-8/10 min-w-8/10">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          {dialogContent.reactChildren}
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Modal Context Provider Failed");
  }
  return context;
};

export { useDialogContext, DialogProvider };
