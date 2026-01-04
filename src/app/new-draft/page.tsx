// src/app/dashboard/new-email/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy, Save } from 'lucide-react';

// Define the shape of the user input state
interface DraftInputs {
  userRole: string;
  recipientRole: string;
  tone: string;
  details: string;
}

export default function NewEmailDraftPage() {
  const [draft, setDraft] = useState<DraftInputs>({
    userRole: '',
    recipientRole: '',
    tone: '',
    details: '',
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  /**
   * Handles the click event for the Generate button.
   * This function sends the user's input to the secure Next.js API route.
   */
  const handleGenerate = useCallback(async () => {
    // 1. Basic Validation
    if (!draft.userRole || !draft.recipientRole || !draft.tone || !draft.details) {
      setError('Please fill in all required fields (Roles, Tone, and Details).');
      return;
    }

    // Reset states and set loading
    setIsLoading(true);
    setError(null);
    setGeneratedEmail('');
    setCopySuccess(false);

    try {
      // 2. Make the API call to the server-side AI generation route
      // This is the fetch request to the server-side code in:
      // src/app/api/generate-email/route.ts
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server-side errors returned by the API route
        throw new Error(data.error || 'Failed to generate email draft due to a server error.');
      }

      // 3. Update the state with the successful result
      setGeneratedEmail(data.email);
    } catch (err) {
      console.error('Generation Error:', err);
      // Display a user-friendly error message
      setError('An error occurred. Check the console and ensure your GEMINI_API_KEY is correctly set in the backend.');
    } finally {
      setIsLoading(false);
    }
  }, [draft]);

  /**
   * Copies the generated email text to the user's clipboard.
   */
  const handleCopy = useCallback(() => {
    if (generatedEmail) {
      // Use standard clipboard API
      navigator.clipboard.writeText(generatedEmail).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2s
      });
    }
  }, [generatedEmail]);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">
        AI Email Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Input your context below to let the AI draft a perfect email for you.
      </p>

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Generation Failed</p>
          <p>{error}</p>
          <p className="mt-2 text-sm italic">If this error persists, ensure your `GEMINI_API_KEY` is set in `.env.local`.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* -------------------- Input Form Card -------------------- */}
        <Card className="shadow-xl dark:bg-gray-800">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="text-xl">Context & Tone</CardTitle>
            <CardDescription>Define the relationship and what you need to communicate.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* User Role Input */}
            <div className="space-y-2">
              <Label htmlFor="userRole">Your Role (Sender)</Label>
              <Select onValueChange={(value) => setDraft(prev => ({...prev, userRole: value}))} disabled={isLoading}>
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
              </Select>
            </div>

            {/* Recipient Role Input */}
            <div className="space-y-2">
              <Label htmlFor="recipientRole">Recipient's Role</Label>
              <Select onValueChange={(value) => setDraft(prev => ({...prev, recipientRole: value}))} disabled={isLoading}>
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
              </Select>
            </div>

            {/* Tone Input */}
            <div className="space-y-2">
              <Label htmlFor="tone">Tone of the Email</Label>
              <Select onValueChange={(value) => setDraft(prev => ({...prev, tone: value}))} disabled={isLoading}>
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
              <Label htmlFor="details">Email Details (Key Information/Request)</Label>
              <Textarea
                id="details"
                placeholder="e.g., Confirming the next meeting is Friday at 2 PM regarding the Q4 budget. We need to discuss the new marketing plan."
                value={draft.details}
                onChange={(e) => setDraft(prev => ({...prev, details: e.target.value}))}
                rows={7}
                disabled={isLoading}
              />
            </div>

            {/* Generate Button (with loading state) */}
            <Button 
                onClick={handleGenerate} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition duration-200"
                disabled={isLoading}
            >
                {isLoading ? (
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
            <CardTitle className="text-xl">Generated Draft</CardTitle>
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
                        {isLoading ? 'The AI is composing the perfect email...' : 'Your draft will appear here after generation.'}
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
                <Button className="bg-sky-500 hover:bg-sky-600 text-white flex items-center space-x-2" disabled={!generatedEmail}>
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}