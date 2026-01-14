"use server";

import { db } from "@/drizzle";
import { IQuotaUsage } from "@/lib/interfaces";
import { sql } from "drizzle-orm";

export const getMonthQuotaUsage = async (userId: string, month: number): Promise<IQuotaUsage> => {
  let quotaUsage: IQuotaUsage = {
    month: month + 1,
    drafts: 0,
    draftsQuota: 0,
    saves: 0,
    saveQuota: 0,
    userPlan: 0
  }

  console.log('Month: ', month);

  try {
    const res = (await db.execute(sql`
        SELECT ${month + 1} month, monthlyGenerationlimit draftsQuota, draftSaveLimit saveQuota, userPlan,
          (SELECT count(*) FROM drafts_generation_track WHERE userId = ${userId} AND month(generatedOn) = ${month + 1}) drafts,
          (SELECT count(*) FROM email_drafts WHERE userId = ${userId}) saves
        FROM user_metrics WHERE userId = ${userId}`)) as unknown as IQuotaUsage[][];
    
    console.log("Results: ", res[0][0] as IQuotaUsage);

    quotaUsage= res[0][0];

    return quotaUsage;
  } catch (e) {
    console.error(e);
    return quotaUsage;
  }
}