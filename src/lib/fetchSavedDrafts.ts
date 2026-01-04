'use server'
import { EmailDrafts } from "@/drizzle/schema";
import { IDraft, IDraftCard } from "./interfaces";
import { TDraftElementsCategory } from "@/data/types";
import { db } from "@/drizzle";
import { desc, eq } from "drizzle-orm";

const getDraftCardElements = (emailDraftData: typeof EmailDrafts.$inferSelect): IDraftCard => {
  const draftCard: IDraftCard = {
    id: emailDraftData.id,
    title: emailDraftData.title,
    snippet: emailDraftData.generatedEmail?.substring(0, 50)+'...',
    date: new Date(emailDraftData.createDateTime!).toLocaleDateString()
  } 

  return draftCard;
}

const getDraftElements = (emailDraftData: typeof EmailDrafts.$inferSelect): IDraft => {
  const draf: IDraft = {
    id: emailDraftData.id,
    title: emailDraftData.title,
    snippet: emailDraftData.generatedEmail?.substring(0, 50) + '...',
    date: new Date(emailDraftData.createDateTime!).toLocaleDateString(),
    userId: emailDraftData.userId,
    emailTone: emailDraftData.emailTone ?? '',
    emailDetails: emailDraftData.emailDetails ? emailDraftData.emailDetails : '',
    recipRole: emailDraftData.recipRole ?? '',
    senderRole: emailDraftData.senderRole ?? '',
    generatedDraft: emailDraftData.generatedEmail ?? '',
    deleted: emailDraftData.deleted ?? false
  } 

  return draf;
}

const createDraftCards = (emailDrafts: (typeof EmailDrafts.$inferSelect)[]): IDraftCard[] => {
  let draftCards: IDraftCard[] = [];

  emailDrafts.map(ed => {
    draftCards.push(getDraftCardElements(ed));
  });

  return draftCards;
}

const createDrafts = (emailDrafts: (typeof EmailDrafts.$inferSelect)[]): IDraft[] => {
  let drafts: IDraft[] = [];

  emailDrafts.map(ed => {
    drafts.push(getDraftElements(ed));
  });

  return drafts;
}

const fetchAndCreateDraftCards = async (desData: { userId: string | undefined | null, count: number }, draftType: TDraftElementsCategory = TDraftElementsCategory.CARD)  => {
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

    const results = desData.count > 0 ?
            await db.select().
                from(EmailDrafts)
                .where(eq(EmailDrafts.userId, desData.userId!))
                .orderBy(desc(EmailDrafts.createDateTime))
                .limit(desData.count) :
            await db.select().
                from(EmailDrafts)
                .where(eq(EmailDrafts.userId, desData.userId!))
                .orderBy(desc(EmailDrafts.createDateTime));

    const response = results;

    // handle the response from the fetch()
    // console.log('Response: ', response);

    const drafts: IDraft[] | IDraftCard[] = draftType == TDraftElementsCategory.CARD 
      ? createDraftCards(response) 
      : createDrafts(response);
    
      return drafts;
}

export default fetchAndCreateDraftCards;