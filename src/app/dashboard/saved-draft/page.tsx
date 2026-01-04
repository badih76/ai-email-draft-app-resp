'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { IDraftInputs } from '@/lib/interfaces';
import { useSearchParams } from 'next/navigation';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

// Define the shape of the user input state

export default function SavedEmailDraftPage() {
  const { user, isLoading } = useKindeBrowserClient();
  
  const searchParams = useSearchParams();
  const [ userId, setUserId ] = useState<string>("")
  const [ draftId, setDraftId ] = useState<string>("");
  
  useEffect(() => {
    setDraftId(searchParams.get('draftId') as string);
  }, []);
    
  const [draft, setDraft] = useState<IDraftInputs>({
    userRole: '',
    title: '',
    recipientRole: '',
    tone: '',
    details: '',
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isMyLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [promptCopySuccess, setPromptCopySuccess] = useState(false);

  useEffect(() => {
    const fetchDraft = async (userId: string, draftId: string) => {
      const data = { userId, draftId }

      const res = await fetch('/api/getSavedDraft',
        {
          method: 'post',
          cache: "no-cache",
          body: JSON.stringify({ data,
            //  accessToken 
            })
        });

        const response = await res.json();
        console.log(response.data);

        if(response.data[0]) {
          let savedDraft: IDraftInputs = {
            userRole: response.data[0].senderRole,
            recipientRole: response.data[0].recipRole,
            tone: response.data[0].emailTone,
            details: response.data[0].emailDetails,
            title: response.data[0].title
          }
          console.log(savedDraft);
          setDraft(prev => ({...savedDraft}));
          setGeneratedEmail(response.data[0].generatedEmail)
        }
    }

    if(user?.id && draftId && !isLoading) {
      fetchDraft(user.id, draftId)
      setUserId(user.id);
    }
  }, [isLoading]);


  // Function to copy the generated text to the clipboard
  const handleCopy = useCallback(() => {
    if (generatedEmail) {
      navigator.clipboard.writeText(generatedEmail).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2s
      });
    }
    console.log(draft);
  }, [generatedEmail]);

  const handlePromptCopy = useCallback(() => {
    if (draft.details) {
      navigator.clipboard.writeText(draft.details).then(() => {
        setPromptCopySuccess(true);
        setTimeout(() => setPromptCopySuccess(false), 2000); // Reset success message after 2s
      });
    }
    console.log(draft);
  }, [draft.details]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Saved Email Draft
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* -------------------- Input Form Card -------------------- */}
        <Card className="shadow-xl dark:bg-gray-800">
          {/* <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="text-xl text-indigo-600">Context & Tone</CardTitle>
            <CardDescription>Define the relationship and what you need to communicate.</CardDescription>
          </CardHeader> */}
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title" className='text-indigo-600'>Draft Title</Label>
                <Input type="text" placeholder='Draft Title...' 
                    onChange={(e) => {
                    let title = e.currentTarget.value;
                    setDraft(prev => ({...prev, title}))
                    }} disabled={isMyLoading} readOnly={true}
                    value={draft.title}
                />
            </div>
            
            {/* User Role Input */}
            <div className="space-y-2">
              <Label htmlFor="userRole" className='text-indigo-600'>Your Role (Sender)</Label>
              <Input type="text" placeholder='Your Role (Sender)...' 
                onChange={(e) => {
                  let userRole = e.currentTarget.value;
                  setDraft(prev => ({...prev, userRole}))
                }} disabled={isMyLoading} readOnly={true}
                value={draft.userRole}
                />
            </div>

            {/* Recipient Role Input */}
            <div className="space-y-2">
              <Label htmlFor="recipientRole" className='text-indigo-600'>Recipient's Role</Label>
              <Input type="text" placeholder='Recipient Role...' 
                onChange={(e) => {
                  let recipientRole = e.currentTarget.value;
                  setDraft(prev => ({...prev, recipientRole}))
                }} disabled={isMyLoading} readOnly={true} 
                value={draft.recipientRole}
                />
            </div>

            {/* Tone Input */}
            <div className="space-y-2">
              <Label htmlFor="tone" className='text-indigo-600'>Tone of the Email</Label>
              <Input type="text" 
                disabled={isMyLoading} readOnly={true} 
                value={draft.tone}
                />
            </div>

            {/* Details of the email */}
            <div className="space-y-2">
              <Label htmlFor="details" className='text-indigo-600'>Email Details (Key Information/Request)</Label>
              <Textarea
                id="details"
                placeholder="e.g., Confirming the next meeting is Friday at 2 PM regarding the Q4 budget. We need to discuss the new marketing plan."
                value={draft.details}
                onChange={(e) => setDraft(prev => ({...prev, details: e.target.value}))}
                rows={7}
                disabled={isMyLoading} readOnly={true}
              />
            </div>
            <Button 
                variant="outline"
                onClick={handlePromptCopy}
                className="flex items-center space-x-2"
            >
                <Copy className="h-4 w-4" />
                <span>{promptCopySuccess ? 'Copied!' : 'Copy draft details to Clipboard'}</span>
            </Button>
          </CardContent>
        </Card>

        {/* -------------------- Output Result Card -------------------- */}
        <Card className="shadow-xl dark:bg-gray-800">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="text-xl text-indigo-600">Generated Draft</CardTitle>
            <CardDescription>The AI-generated email is ready for review.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
                {generatedEmail ? (
                    <Textarea 
                        readOnly 
                        value={generatedEmail} 
                        rows={22} 
                        className="min-h-[400px] font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                ) : (
                    <div className="min-h-[400px] border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 italic dark:text-gray-400 p-4">
                        {isMyLoading ? 'The AI is composing the perfect email...' : 'Your draft will appear here after generation.'}
                    </div>
                )}
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
                <Button 
                    variant="outline"
                    onClick={handleCopy}
                    className="flex items-center space-x-2"
                >
                    <Copy className="h-4 w-4" />
                    <span>{copySuccess ? 'Copied!' : 'Copy genertated email to Clipboard'}</span>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}