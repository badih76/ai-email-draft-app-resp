export interface IDraftInputs {
  userRole: string;
  recipientRole: string;
  tone: string;
  details: string;
  title: string;
}

export interface IDraftEmailSave extends IDraftInputs {
    userId: string;
    generatedEmail: string;
}

export interface IAPIResponse {
  status: number,
  data: any,
  message: string,
  error: string | null
}

export interface IDraftCard {
  id: string,
  title: string,
  snippet: string,
  date: string
}

export interface IDraftsTableColumns {
  [key: string]: string
}

export interface IDraft extends IDraftCard {
  userId: string,
  emailTone: string,
  emailDetails: string,
  recipRole: string,
  senderRole: string,
  generatedDraft: string,
  deleted: boolean
}

export interface ILinkItemProps {
    href: string, 
    title: string, 
    children: React.ReactNode
}

export interface ILogDraftReturn {
  status: number,
  error: string
}

export interface IBillingTransaction {
    date: string,
    type: "Invoice" | "Payment",
}
