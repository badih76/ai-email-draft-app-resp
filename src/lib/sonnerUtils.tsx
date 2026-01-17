import { toast } from "sonner";
import { AlertTriangle } from 'lucide-react';


export const ToastError = (text: string) => {
    return(
    toast.error("The usage of profane, offensive and inappropriate words is not allowed!", {
      // Customizing the icon
        icon: <AlertTriangle className="h-5 w-5" />,
        // Applying Tailwind classes for the red background and white text
        style: {
          backgroundColor: '#ef4444', // Tailwind red-500
          color: '#ffffff',
          border: 'none',
        },
      })
    )
}