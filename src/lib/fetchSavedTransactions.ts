'use server'
import { EmailDrafts } from "@/drizzle/schema";
import { IBillingTransaction, IDraft, IDraftCard } from "./interfaces";
import { TDraftElementsCategory } from "@/data/types";
import { db } from "@/drizzle";
import { desc, eq } from "drizzle-orm";

const getTransactionCardElements = (transactionData: IBillingTransaction): IBillingTransaction => {
  const transactionCard: IBillingTransaction = {
    date: new Date(transactionData.date).toLocaleDateString(),
    type: transactionData.type,
    // date: new Date(emailDraftData.createDateTime!).toLocaleDateString()
  } 

  return transactionCard;
}

// const getDraftElements = (transactionsData: IBillingTransaction): IBillingTransaction => {
//   const draf: IDraft = {
//     id: emailDraftData.id,
//     title: emailDraftData.title,
//     snippet: emailDraftData.generatedEmail?.substring(0, 50) + '...',
//     date: new Date(emailDraftData.createDateTime!).toLocaleDateString(),
//     userId: emailDraftData.userId,
//     emailTone: emailDraftData.emailTone ?? '',
//     emailDetails: emailDraftData.emailDetails ? emailDraftData.emailDetails : '',
//     recipRole: emailDraftData.recipRole ?? '',
//     senderRole: emailDraftData.senderRole ?? '',
//     generatedDraft: emailDraftData.generatedEmail ?? '',
//     deleted: emailDraftData.deleted ?? false
//   } 

//   return draf;
// }

const createTransactionsCards = (transactions: IBillingTransaction[]): IBillingTransaction[] => {
  let transactionCards: IBillingTransaction[] = [];

  transactions.map(ed => {
    transactionCards.push(getTransactionCardElements(ed));
  });

  return transactionCards;
}

const createTransactions = (transactionsList: IBillingTransaction[]): IBillingTransaction[] => {
  let transactions: IBillingTransaction[] = [];

  transactionsList.map(ed => {
    transactions.push(getTransactionCardElements(ed));
  });

  return transactions;
}

const fetchAndCreateTransactionsCards = async (desData: { userId: string | undefined | null, count: number }, 
        transactionType: TDraftElementsCategory = TDraftElementsCategory.CARD)  => {
    // const domain = process.env.KINDE_SITE_URL //getDomainName();
    // console.log(domain + '/api/getSavedEmailDrafts');

    // const res = await fetch(domain + '/api/getSavedEmailDrafts',
    //     {
    //       method: 'post',
    //       cache: "no-cache",
    //       body: JSON.stringify({ desData,
    //         //  accessToken 
    //         })
    //     });

    const transactionsList: IBillingTransaction[] = [
    {  
        date: '2025-01-10',
        type: "Invoice"
    },
    {
        date: '2025-01-12',
        type: "Payment"
    },
    {  
        date: '2025-02-10',
        type: "Invoice"
    },
    {
        date: '2025-02-12',
        type: "Payment"
    }
]

    // const results = desData.count > 0 ?
    //         await db.select().
    //             from(EmailDrafts)
    //             .where(eq(EmailDrafts.userId, desData.userId!))
    //             .orderBy(desc(EmailDrafts.createDateTime))
    //             .limit(desData.count) :
    //         await db.select().
    //             from(EmailDrafts)
    //             .where(eq(EmailDrafts.userId, desData.userId!))
    //             .orderBy(desc(EmailDrafts.createDateTime));

    const response = transactionsList;

    // handle the response from the fetch()
    // console.log('Response: ', response);

    const transactions: IBillingTransaction[] = transactionType == TDraftElementsCategory.CARD 
      ? createTransactionsCards(response) 
      : createTransactions(response);
    
      return transactions;
}

export default fetchAndCreateTransactionsCards;