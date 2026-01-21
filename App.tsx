import React, { useState } from 'react';
import { FormData, AppStep, INITIAL_HEADERS } from './types';
import Step1Initial from './components/Step1Initial';
import Step2Questions from './components/Step2Questions';
import Step3Headers from './components/Step3Headers';
import Step4Confirmation from './components/Step4Confirmation';
import ResultDisplay from './components/ResultDisplay';
import { generateClarifyingQuestions, generateExecutionPlan, generateFinalSystemPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INITIAL_DETAILS);
  const [loading, setLoading] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    buildIntent: "",
    workflowJson: "",
    model: "",
    characterCount: "",
    tools: "",
    expectedInput: "",
    expectedOutput: "",
    aiQuestions: [],
    userAnswers: {},
    selectedHeaders: [...INITIAL_HEADERS],
    aiPlan: []
  });

  const updateFormData = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = async () => {
    setLoading(true);
    try {
      if (currentStep === AppStep.INITIAL_DETAILS) {
        // Generate Questions
        const questions = await generateClarifyingQuestions(formData.buildIntent, formData.workflowJson);
        updateFormData({ aiQuestions: questions });
        setCurrentStep(AppStep.AI_QUESTIONS);
      } else if (currentStep === AppStep.AI_QUESTIONS) {
        // Move to Headers (Local logic only)
        setCurrentStep(AppStep.HEADER_SELECTION);
      } else if (currentStep === AppStep.HEADER_SELECTION) {
        // Generate Plan
        const plan = await generateExecutionPlan(formData);
        updateFormData({ aiPlan: plan });
        setCurrentStep(AppStep.CONFIRMATION);
      } else if (currentStep === AppStep.CONFIRMATION) {
        // Generate Final Prompt
        const prompt = await generateFinalSystemPrompt(formData);
        setFinalPrompt(prompt);
        setCurrentStep(AppStep.RESULT);
      }
    } catch (error) {
      console.error("Error in wizard flow:", error);
      alert("Something went wrong with the AI generation. Please check the console or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      buildIntent: "",
      workflowJson: "",
      model: "",
      characterCount: "",
      tools: "",
      expectedInput: "",
      expectedOutput: "",
      aiQuestions: [],
      userAnswers: {},
      selectedHeaders: INITIAL_HEADERS.map(h => ({...h, selected: h.required, inputValue: ""})),
      aiPlan: []
    });
    setFinalPrompt("");
    setCurrentStep(AppStep.INITIAL_DETAILS);
  };

  const getStepTitle = (step: AppStep) => {
    switch(step) {
      case AppStep.INITIAL_DETAILS: return "Project Details";
      case AppStep.AI_QUESTIONS: return "AI Clarification";
      case AppStep.HEADER_SELECTION: return "Prompt Structure";
      case AppStep.CONFIRMATION: return "Review Plan";
      case AppStep.RESULT: return "Final Result";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-n8n-primary rounded-md flex items-center justify-center text-white font-bold">
              n8n
            </div>
            <h1 className="text-xl font-bold text-gray-900">System Prompt Generator</h1>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Step {currentStep} of 5
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100">
          <div 
            className="h-full bg-n8n-primary transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 min-h-[600px] flex flex-col">
           {currentStep === AppStep.INITIAL_DETAILS && (
             <Step1Initial data={formData} updateData={updateFormData} onNext={nextStep} />
           )}
           {currentStep === AppStep.AI_QUESTIONS && (
             <Step2Questions data={formData} updateData={updateFormData} onNext={nextStep} isLoading={loading} />
           )}
           {currentStep === AppStep.HEADER_SELECTION && (
             <Step3Headers data={formData} updateData={updateFormData} onNext={nextStep} />
           )}
           {currentStep === AppStep.CONFIRMATION && (
             <Step4Confirmation data={formData} onNext={nextStep} isLoading={loading} />
           )}
           {currentStep === AppStep.RESULT && (
             <ResultDisplay prompt={finalPrompt} onReset={handleReset} isLoading={loading} />
           )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          Powered by Gemini 2.5 • Designed for n8n Automation
        </div>
      </footer>
    </div>
  );
};

export default App;