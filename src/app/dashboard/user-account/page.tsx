'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy, Save } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";


// Define the shape of the user input state

export default function AccountPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const { user, isLoading } = useKindeBrowserClient();
  const [ userDisplayName, setUserDisplayName ] = useState<string>('');
  
  useEffect(() => {
    // console.log('User: ', user);
    setUserDisplayName(user?.email ?? 'No found');
  }, [ isLoading ]);

  
  
  // const data = dataString ? JSON.parse(dataString) : null;
  
  const [isMyLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        My Account
      </h1>
      

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Please, correct the following:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="w-full">
        {/* -------------------- Input Form Card -------------------- */}
        <Card className="shadow-xl dark:bg-gray-800">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="text-xl text-indigo-600">Personal Details</CardTitle>
            {/* <CardDescription>Define the relationship and what you need to communicate.</CardDescription> */}
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className='text-indigo-600'>Display Name</Label>
              <Input type="text" placeholder='Draft Title...' 
                onChange={(e) => {
                  let newDisplayName = e.currentTarget.value;
                  setUserDisplayName(prev => (newDisplayName))
                }} disabled={isMyLoading} 
                value={userDisplayName} 
              />
            </div>

            {/* Tone Input */}
            <div className="space-y-2">
              <Label htmlFor="tone" className='text-indigo-600'>Current Plan</Label>
              <Select 
                // onValueChange={(value) => setDraft(prev => ({...prev, tone: value}))} 
                disabled={isMyLoading}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select the desired plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free Plan</SelectItem>
                  <SelectItem value="Plus">Plus Plan - $4.99 / Month</SelectItem>
                  <SelectItem value="Pro">Pro Plan - $19.99 / Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button (with loading state) */}
            <Button 
                // onClick={handleGenerate} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition duration-200"
                disabled={isMyLoading}
            >
                {isMyLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting Email...</>
                ) : (
                    'Generate Email Draft'
                )}
            </Button>
          </CardContent>
        </Card>        
      </div>
    </div>
  );
}