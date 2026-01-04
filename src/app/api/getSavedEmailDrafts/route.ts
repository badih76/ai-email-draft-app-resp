
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from 'next/cache'
import { EmailDrafts } from "@/drizzle/schema";
// import { ELogLevel, ILogObject } from "@/loggerServices/loggerInterfaces";
// import { Logger } from "@/loggerServices/logger";
import { db } from "@/drizzle";
import { desc, eq } from "drizzle-orm";
import { IAPIResponse } from "@/lib/interfaces";

export async function POST(req: NextRequest) {
    noStore();

    console.log("Using API Calls");
    
    let response: IAPIResponse = {
            status: 200,
            data: null,
            message: "",
            error: null
        };

    try {
        const request = await req.json();
        console.log("Request: ", request);

        const data = request.desData;
        console.log('API Data: ', data);
        
        const { getUser
            // , getIdToken, getAccessToken 
        } = getKindeServerSession();
        const user = await getUser();
    
        // if(!user || !user.id) {
        //     // const logObj: ILogObject = {
        //     //     level: ELogLevel.Info,
        //     //     message: `User not found or no user logged in. This action cannot be performed.`,
        //     //     metaData: {
        //     //         service: "ESM-bnb-14",
        //     //         module: "api/reservations/add",
        //     //         category: "User Authentication",
        //     //     }};
        //     // Logger.log(logObj);
            
        //     return NextResponse.json({ Error: "User not found or no user logged in. This action cannot be performed." }, 
        //         { status: 500 })
        // }

        /*
            userId: string;
            userRole: string;
            recipientRole: string;
            tone: string;
            details: string;
            title: string;
            generatedEmail: string
        */
    
        const userId = data.userId as string;
        const count = data.count as number;
        console.log('API UserId: ', userId);
        
        // await db.insert(EmailDrafts).values({
        //     userId: userId,
        //     title: title,
        //     emailTone: emailTone,
        //     emailDetails: emailDetails,
        //     recipRole: recipRole,
        //     senderRole: senderRole,
        //     generatedEmail: generatedEmail,
        //     createDateTime: new Date(),
        //     deleted: false,

        // })
        
        const results = count > 0 ?
            await db.select().
                from(EmailDrafts)
                .where(eq(EmailDrafts.userId, userId))
                .orderBy(desc(EmailDrafts.createDateTime))
                .limit(count) :
            await db.select().
                from(EmailDrafts)
                .where(eq(EmailDrafts.userId, userId))
                .orderBy(desc(EmailDrafts.createDateTime));

        console.log(results);

        // const logObj: ILogObject = {
        //     level: ELogLevel.Info,
        //     message: `Reservation create for homeId: ${homeId} and userId: ${userId}, startDate: ${startDate}, endDate: ${endDate}.`,
        //     metaData: {
        //         service: "ESM-bnb-14",
        //         module: "api/reservations/add",
        //         category: "API Call",
        //     }};
        // Logger.log(logObj);
            
        // return redirect("/reservations");
        response = {
            status: 200,
            data: results,
            message: 'Fetched Saved Email Drafts Successfully',
            error: null
        }

    } catch(ex) {
        // const logObj: ILogObject = {
        //     level: ELogLevel.Error,
        //     message: `Error: ${(ex as Error).message}`,
        //     metaData: {
        //       service: "ESM-bnb-14",
        //       module: "api/reservations/add",
        //       category: "API Call",
        //       stackdump: (ex as Error).stack,
        //     },
        //   };
        // Logger.log(logObj);
        console.log('Error: ', (ex as Error).message);

        // return redirect("/Error");
        response = {
            status: 500,
            data: null,
            message: 'Unsuccessful fetch of saved email drafts',
            error: (ex as Error).message
        }
    }

    return NextResponse.json(response); 
    
}