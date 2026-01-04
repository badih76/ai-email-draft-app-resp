import { db } from "."
import { DraftsGenerationLog } from "./schema"

export const logDraftGeneration = async (userId: string)=> {
    try {
        const res = await db.insert(DraftsGenerationLog)
            .values({ userId: userId })
        
        console.log('Insert Res: ', res);

        return { status: 200, error: '' }
    } catch(e) {
        console.error(e);
        
        return { status: 500, error: (e as Error).message }
    }
}