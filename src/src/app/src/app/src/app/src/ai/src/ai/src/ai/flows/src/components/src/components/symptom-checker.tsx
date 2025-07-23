"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { runSymptomChecker } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, Siren } from "lucide-react";

export function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const response = await runSymptomChecker(symptoms);
    
    if (response.error) {
      setError(response.error);
    } else if (response.potentialIssues) {
      setResult(response.potentialIssues);
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI Symptom Checker</CardTitle>
        <CardDescription>Describe your symptoms, and our AI will suggest potential issues. This is not a substitute for professional medical advice.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <CardContent className="flex-grow">
          <Textarea
            placeholder="e.g., 'I have a sharp pain in my upper right tooth when I drink something cold...'"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={6}
            required
            className="w-full"
            aria-label="Your dental symptoms"
          />
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button type="submit" disabled={isLoading || symptoms.length < 10} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Check Symptoms"
            )}
          </Button>
          {error && (
             <Alert variant="destructive">
               <Siren className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}
          {result && (
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Potential Issues</AlertTitle>
                <AlertDescription>
                    <p className="font-semibold mb-2">Based on your symptoms, here are some possibilities:</p>
                    <div className="whitespace-pre-wrap text-sm">{result}</div>
                    <p className="text-xs text-muted-foreground mt-3">
                        <strong>Disclaimer:</strong> This is an AI-powered suggestion and not a medical diagnosis. Please consult with a dentist for an accurate assessment.
                    </p>
                </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
