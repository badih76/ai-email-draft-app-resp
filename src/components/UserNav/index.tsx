import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserIcon from "../UserIcon";
import { redirect } from "next/navigation";
import { DynamicIcon } from "lucide-react/dynamic";
import { LogOut } from "lucide-react";
import LinkItem from "../LinkItem";


export async function UserNav() {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        const userPicture = user?.picture ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    
        const useAPI = process.env.USE_API === "1" ? true : false;
    
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <UserIcon userPicture={userPicture} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[175px] text-primary font-medium">
                    { user ? 
                        <>
                            <DropdownMenuItem asChild>
                                <LinkItem title="Account" href="/dashboard/user-account">
                                    <DynamicIcon name="circle-user-round" 
                                        className={`w-5 h-5 mr-3 text-indigo-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"`}
                                    />
                                </LinkItem>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="mx-1 border-2" />
                            <DropdownMenuItem asChild>
                                <LinkItem title="Dashboard" href={"/dashboard?userId="+user.id}>
                                    <DynamicIcon name="bar-chart" 
                                        className={`w-5 h-5 mr-3 text-indigo-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"`}
                                    />
                                </LinkItem>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <LinkItem title="New Email Draft" href={"/dashboard/new-email?userId="+user.id}>
                                    <div className="h-5 w-5 mr-3 bg-indigo-600 rounded-tr-lg rounded-bl-lg 
                                        flex items-center justify-center">
                                        <span className="text-white text-[9px]">AI</span>
                                    </div>
                                </LinkItem>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <LinkItem title="Saved Drafts" href={"/dashboard/saved-drafts?userId="+user.id}>
                                    <DynamicIcon name="file-archive" 
                                        className={`w-5 h-5 mr-3 text-indigo-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"`}
                                    />
                                </LinkItem>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="mx-1 border-2" />
                            <DropdownMenuItem asChild>
                                <LinkItem title="Billing & Quota" href="/dashboard/billing-quota">
                                    <DynamicIcon name="dollar-sign" 
                                        className={`w-5 h-5 mr-3 text-indigo-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"`}
                                    />
                                </LinkItem>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="mx-1 border-2" />
                            <DropdownMenuItem asChild>
                                <div className="flex flex-row justify-start items-center w-full">
                                    <div className="flex justify-center items-center">
                                        {/* <DynamicIcon name="dollar-sign" 
                                            className={`w-5 h-5 mr-3 text-indigo-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"`}
                                        /> */}
                                        <LogOut className={`w-5 h-5 text-red-500 group-hover:text-red-600 dark:group-hover:text-indigo-300"`} />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <LogoutLink className="text-red-500">Logout</LogoutLink>    
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        </>
                        :
                        <>
                            <DropdownMenuItem asChild>
                                <RegisterLink className="w-full">Sign up</RegisterLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <LoginLink className="w-full">Sign in</LoginLink>
                            </DropdownMenuItem>
                        </>
                    }
                    
                </DropdownMenuContent>
            </DropdownMenu>
        )

    } catch(ex) {
        console.log((ex as Error).message);
        // const logObj: ILogObject = {
        //     level: ELogLevel.Error,
        //     message: `Error: ${(ex as Error).message}`,
        //     metaData: {
        //         service: "ESM-bnb-14",
        //         module: "New Home Listing Creation - description",
        //         category: "Home Listing",
        //         stackdump: (ex as Error).stack,
        //     },
        //     };
        // Logger.log(logObj);
        return redirect("/Error");
    }
}