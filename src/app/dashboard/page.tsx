import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Snippet } from 'next/font/google';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import Link from 'next/link';
import { IDraftCard } from '@/lib/interfaces';
import fetchAndCreateDraftCards from '@/lib/fetchSavedDrafts';

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user: KindeUser<Record<string, any>> | null = await getUser();
  const userId = user?.id;
  const desData = { userId, count: 3 };
  const drafts: IDraftCard[] = await fetchAndCreateDraftCards(desData);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Recent Activity
        </h1>

        {/* Circular Link Button to New Email Draft Page */}
        {/* <div className='absolute right-100 top-200'>
          <Link href="/dashboard/new-email" passHref>
            <Button
              className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 shadow-lg transition-transform duration-200 hover:scale-105"
              aria-label="Create New Email Draft"
            >
              <Plus className="w-6 h-6 text-white" />
            </Button>
          </Link>
        </div> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {drafts.map((draft) => (
          <Card key={draft.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-indigo-600 dark:text-indigo-400 text-lg truncate">
                {draft.title}
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">{draft.date}</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 text-sm italic line-clamp-2">
                {draft.snippet}
              </p>
              {/* <Button variant="link" className="p-0 h-auto mt-2 text-indigo-500 dark:text-indigo-300">
                View Draft
              </Button> */}
              <Link className='p-0 h-auto mt-2 text-indigo-500 dark:text-indigo-300'
                href={"/dashboard/saved-draft?userId=" + userId + "&draftId=" + draft.id}>
                View Draft
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <hr className='border-gray-400' />

      {/* Placeholder for other content */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
        <h3 className="text-xl font-semibold">Your Usage Stats</h3>
        <p className="text-gray-500 mt-2">
          Summary of drafts generated this month: 15 / 50 limit.
        </p>
      </div>
    </div>
  );
}