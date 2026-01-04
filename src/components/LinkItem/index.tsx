import { ILinkItemProps } from "@/lib/interfaces"
import Link from "next/link";

const LinkItem: React.FC<ILinkItemProps> = ({ href, title, children }) =>{
    return (
        <Link href={href} className="w-full">
            <div className="flex flex-row justify-start items-center w-full">
                <div className="flex justify-center items-center">
                    {children}
                </div>
                <div className="flex justify-center items-center">
                    {title}
                </div>
            </div>
        </Link>
    )
}

export default LinkItem;