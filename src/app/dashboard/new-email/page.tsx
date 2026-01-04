'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy, Save } from 'lucide-react';
import { IDraftEmailSave, IDraftInputs } from '@/lib/interfaces';
import { useSearchParams } from 'next/navigation';

// Define the shape of the user input state

export default function NewEmailDraftPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  // const data = dataString ? JSON.parse(dataString) : null;
  
  const [draft, setDraft] = useState<IDraftInputs>({
    userRole: '',
    title: '',
    recipientRole: '',
    tone: '',
    details: '',
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isMyLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to handle the AI generation API call
  const handleGenerate = useCallback(async () => {
    // 1. Basic Validation
    if (!draft.userRole || !draft.recipientRole || !draft.tone || !draft.details) {
      setError('Please fill in all required fields (Roles, Tone, and Details).');
      return;
    }

    // Reset states
    setIsLoading(true);
    setError(null);
    setGeneratedEmail('');
    setCopySuccess(false);

    try {
      const payload = { draft, userId };

      // 2. Make the API call to the Next.js route
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(response);
        // Handle server-side errors (e.g., missing API key, model failure)
        throw new Error(data.error || 'Failed to generate email draft due to a server error.');
      }

      // 3. Update the state with the successful result
      setGeneratedEmail(data.email);
    } catch (err) {
      console.error('Generation Error:', err);
      setError('An error occurred. Please check the console for details and ensure your GEMINI_API_KEY is set.');
    } finally {
      setIsLoading(false);
    }
  }, [draft]);

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

  const handleSaveDraft = async () => {
    // gather the required data to send to the API
    const desData: IDraftEmailSave = {
      userId: userId!,
      userRole: draft.userRole,
      recipientRole: draft.recipientRole,
      tone: draft.tone,
      details: draft.details,
      title: draft.title,
      generatedEmail: generatedEmail
    }

    // call the API using fetch()
    const domain = process.env.KINDE_SITE_URL //getDomainName();

    console.log(domain + '/api/saveNewDraft');
    
    const res = await fetch(domain + '/api/saveNewDraft',
        {
          method: 'post',
          cache: "no-cache",
          body: JSON.stringify({ desData,
            //  accessToken 
            })
        });

    const response = await res.json();

    // handle the response from the fetch()
    console.log(response);

  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        New Email Draft
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Input your context below to let the AI draft a perfect email for you.
      </p>

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Generation Failed</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* -------------------- Input Form Card -------------------- */}
        <Card className="shadow-xl dark:bg-gray-800">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="text-xl text-indigo-600">Context & Tone</CardTitle>
            <CardDescription>Define the relationship and what you need to communicate.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className='text-indigo-600'>Draft Title</Label>
              <Input type="text" placeholder='Draft Title...' 
                onChange={(e) => {
                  let title = e.currentTarget.value;
                  setDraft(prev => ({...prev, title}))
                }} disabled={isMyLoading} />
            </div>
            
            {/* User Role Input */}
            <div className="space-y-2">
              <Label htmlFor="userRole" className='text-indigo-600'>Your Role (Sender)</Label>
              <Input type="text" placeholder='Your Role (Sender)...' 
                onChange={(e) => {
                  let userRole = e.currentTarget.value;
                  setDraft(prev => ({...prev, userRole}))
                }} disabled={isMyLoading} />
              {/* <Select onValueChange={(value) => setDraft(prev => ({...prev, userRole: value}))} disabled={isLoading}>
                <SelectTrigger id="userRole">
                  <SelectValue placeholder="Select your profession/role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales Lead">Sales Lead</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
                  <SelectItem value="Customer Support">Customer Support</SelectItem>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                </SelectContent>
              </Select> */}
            </div>

            {/* Recipient Role Input */}
            <div className="space-y-2">
              <Label htmlFor="recipientRole" className='text-indigo-600'>Recipient's Role</Label>
              <Input type="text" placeholder='Recipient Role...' 
                onChange={(e) => {
                  let recipientRole = e.currentTarget.value;
                  setDraft(prev => ({...prev, recipientRole}))
                }} disabled={isMyLoading} />
              {/* <Select onValueChange={(value) => setDraft(prev => ({...prev, recipientRole: value}))} disabled={isLoading}>
                <SelectTrigger id="recipientRole">
                  <SelectValue placeholder="Select recipient's role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Team Member">Team Member</SelectItem>
                  <SelectItem value="Job Candidate">Job Candidate</SelectItem>
                  <SelectItem value="Upper Management">Upper Management</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                </SelectContent>
              </Select> */}
            </div>

            {/* Tone Input */}
            <div className="space-y-2">
              <Label htmlFor="tone" className='text-indigo-600'>Tone of the Email</Label>
              <Select onValueChange={(value) => setDraft(prev => ({...prev, tone: value}))} disabled={isMyLoading}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select the desired tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Friendly and Casual">Friendly and Casual</SelectItem>
                  <SelectItem value="Urgent and Direct">Urgent and Direct</SelectItem>
                  <SelectItem value="Formal and Serious">Formal and Serious</SelectItem>
                  <SelectItem value="Apologetic">Apologetic</SelectItem>
                  <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
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
                disabled={isMyLoading}
              />
            </div>

            {/* Generate Button (with loading state) */}
            <Button 
                onClick={handleGenerate} 
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
                        rows={20} 
                        className="min-h-[400px] font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                ) : (
                    <div className="min-h-[400px] border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 italic dark:text-gray-400 p-4">
                        {isMyLoading ? 'The AI is composing the perfect email...' : 'Your draft will appear here after generation.'}
                    </div>
                )}
            </div>
            
            <div className="flex justify-end mt-4 space-x-3">
                <Button 
                    variant="outline"
                    onClick={handleCopy}
                    disabled={!generatedEmail}
                    className="flex items-center space-x-2"
                >
                    <Copy className="h-4 w-4" />
                    <span>{copySuccess ? 'Copied!' : 'Copy to Clipboard'}</span>
                </Button>
                {/* This button is a placeholder for future Firestore saving logic */}
                {/* <form action={"/api/saveNewDraft"} method="POST">
                  <input type="hidden" name="userId" value={data.id} />
                  <input type="hidden" name="title" value={draft.title} />
                  <input type="hidden" name="userRole" value={draft.userRole} />
                  <input type="hidden" name="recipientRole" value={draft.recipientRole} />
                  <input type="hidden" name="tone" value={draft.tone} />
                  <input type="hidden" name="details" value={draft.details} />
                  <input type="hidden" name="generatedDraft" value={generatedEmail} /> */}

                <Button className="bg-sky-500 hover:bg-sky-600 text-white flex items-center space-x-2" 
                  disabled={!generatedEmail || !userId}
                  onClick={handleSaveDraft}
                >
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                </Button>
                {/* </form> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}