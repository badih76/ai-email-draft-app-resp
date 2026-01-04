import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from 'next/cache'
import { Users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
// import { Logger } from "@/loggerServices/logger";
// import { ELogLevel, ILogObject } from "@/loggerServices/loggerInterfaces";
import { redirect } from "next/navigation";
import { db } from "@/drizzle";
// import { IUserSettings } from "@/lib/interfaces";

export async function GET(req: NextRequest) {
    noStore();

    
    try {
        const redirectUrl = req.nextUrl.searchParams.get('redirect_url');
      // console.log("Redirect URL: ", redirectUrl);

        const { getUser } = getKindeServerSession();
        const returnUrl = redirectUrl ? process.env.KINDE_SITE_URL! + redirectUrl : process.env.KINDE_SITE_URL + '/dashboard' ;
        // const returnUrl = process.env.KINDE_SITE_URL ;

        const user = await getUser();
        
        if(!user || user === null || !user.id) {
            // const logObj: ILogObject = {
            //     level: ELogLevel.Info,
            //     message: `No user was found.`,
            //     metaData: {
            //       service: "ESM-bnb-14",
            //       module: "api/auth/create",
            //       category: "User Authentication",
            //     },
            //   };
            //   Logger.log(logObj);

            return NextResponse.json({
                status: 200,
                error: "User Not Found!"
            })
        } else {
            
            const dbUser = await db.select().from(Users).where(eq(Users.id, user.id));

            // const userSettings: IUserSettings = {
            //   hideDeletedListings: true,
            //   currency: "AUD"
            // }
        
            if(dbUser.length === 0) {
                const newUser: typeof Users.$inferInsert = {
                    id: user.id!, //user.id,
                    email: user.email!,
                    firstName: user.given_name!,
                    lastName: user.family_name!,
                    profileImage: user.picture ? user.picture : `https://avatar.vercel.sh/${user.given_name}`
                }
                await db.insert(Users).values(newUser);

                // const logObj: ILogObject = {
                //     level: ELogLevel.Info,
                //     message: `New user added in Users table. userID: ${user.id}`,
                //     metaData: {
                //       service: "ESM-bnb-14",
                //       module: "api/auth/create",
                //       category: "User Authentication",
                //     },
                //   };
                // Logger.log(logObj);
            }
            else { 
                // const logObj: ILogObject = {
                //     level: ELogLevel.Info,
                //     message: `User already exists in Users table. userID: ${user.id}`,
                //     metaData: {
                //       service: "ESM-bnb-14",
                //       module: "api/auth/create",
                //       category: "User Authentication",
                //     },
                //   };
                // Logger.log(logObj);
            }
            
            return NextResponse.redirect(returnUrl!);
    
        }

    }
    catch(ex) {
        if((ex as Error).message === "NEXT_REDIRECT") throw ex;
        else {
        //   const logObj: ILogObject = {
        //       level: ELogLevel.Error,
        //       message: `Error: ${(ex as Error).message}`,
        //       metaData: {
        //         service: "ESM-bnb-14",
        //         module: "api/auth/create",
        //         category: "User Authentication",
        //         stackdump: (ex as Error).stack,
        //       },
        //     };
        //   Logger.log(logObj);
  
          return redirect("/Error");

        }
    }
}