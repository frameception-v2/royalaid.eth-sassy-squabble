"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, { AddFrame, type Context } from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { PROJECT_TITLE, QUIZ_QUESTIONS } from "~/lib/constants";

function QuizCard({ currentQuestion, score, handleAnswer }: {
  currentQuestion: number;
  score: number;
  handleAnswer: (isCorrect: boolean) => void;
}) {
  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Maschine Capability Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm font-medium mb-4">{question.question}</div>
        <div className="grid grid-cols-2 gap-2">
          <PurpleButton
            onClick={() => handleAnswer(question.answer === 'yes')}
            className="text-sm"
          >
            Yes, Queen 👑
          </PurpleButton>
          <PurpleButton
            onClick={() => handleAnswer(question.answer === 'no')} 
            className="text-sm"
          >
            Nope, Nada 🙅
          </PurpleButton>
        </div>
        <div className="text-xs text-gray-500">
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
        </div>
      </CardContent>
    </Card>
  );
}

function ResultCard({ score }: { score: number }) {
  const totalQuestions = QUIZ_QUESTIONS.length;
  const sassyResponses = [
    "Did you even try? 😒",
    "Not bad, human... not bad 😏",
    "Okayyyy someone's paying attention! 👏",
    "Perfect score! Now go touch grass 🌱"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          Score: {score}/{totalQuestions}
        </div>
        <div className="text-xs text-gray-500">
          {QUIZ_QUESTIONS[0].sassyResponse}
        </div>
        <div className="text-sm font-medium">
          {score === 0 ? "Yikes... 😬" : 
           score < totalQuestions ? sassyResponses[1] : 
           sassyResponses[3]}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  }, [currentQuestion]);

  // [Previous useEffect and sdk setup remains unchanged...]

  return (
    <div style={{
      paddingTop: context?.client.safeAreaInsets?.top ?? 0,
      paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
      paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
      paddingRight: context?.client.safeAreaInsets?.right ?? 0,
    }}>
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-neutral-900">
          {PROJECT_TITLE}
        </h1>
        
        {!quizCompleted ? (
          <QuizCard 
            currentQuestion={currentQuestion}
            score={score}
            handleAnswer={handleAnswer}
          />
        ) : (
          <ResultCard score={score} />
        )}
      </div>
    </div>
  );
}
