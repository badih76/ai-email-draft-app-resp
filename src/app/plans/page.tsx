import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockDrafts = [
  { id: 1, title: 'Free Plan', snippet: 'Subject: Urgent: Q4 Budget Sign-off Required...', date: '2 hours ago' },
  { id: 2, title: 'Plus Plan', snippet: 'Subject: Welcome to the Team, Jane! We are thrilled to...', date: 'Yesterday' },
  { id: 3, title: 'Pro Plan', snippet: 'Subject: Important Service Update and Apology for...', date: '2 days ago' },
];

function Plans() {
  return (
    <div className='h-screen flex flex-col justify-start items-start'>
      <div>
        Plans
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockDrafts.map((draft) => (
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
              <Button variant="link" className="p-0 h-auto mt-2 text-indigo-500 dark:text-indigo-300">
                View Draft
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Plans