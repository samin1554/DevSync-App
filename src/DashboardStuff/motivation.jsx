import { Card, CardContent } from "../components/ui/card";
import { Lightbulb } from "lucide-react";
import { useState } from "react";

export default function MotivationalSection() {
  const quotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
    "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
    "The secret of getting ahead is getting started. – Mark Twain",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "Hard work beats talent when talent doesn't work hard. – Tim Notke",
    "Don't wish it were easier. Wish you were better. – Jim Rohn",
    "Push yourself, because no one else is going to do it for you. – Unknown",
    "Great things never come from comfort zones. – Roy T. Bennett",
    "Success doesn't just find you. You have to go out and get it. – Unknown",
    "Dream it. Wish it. Do it. – Unknown",
    "The harder you work for something, the greater you'll feel when you achieve it. – Unknown",
    "Don't stop when you're tired. Stop when you're done. – Marilyn Monroe",
    "Wake up with determination. Go to bed with satisfaction. – George Lorimer",
    "Little things make big days. – Isabel Marant",
    "It's going to be hard, but hard does not mean impossible. – Art Williams",
    "Don't wait for opportunity. Create it. – George Bernard Shaw",
    "Sometimes we're tested not to show our weaknesses, but to discover our strengths. – Unknown",
    "The key to success is to start before you're ready. – Marie Forleo",
    "Be stronger than your excuses. – Unknown",
    "Do something today that your future self will thank you for. – Sean Patrick Flanery"
  ];
  
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  function getRandomQuote() {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }
  
  return (
    <Card className="bg-base-100 border border-neutral rounded-xl shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="text-accent text-lg" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Daily Motivation</h3>
        </div>
        <blockquote className="text-gray-700 italic mb-4">
          {quote}
        </blockquote>
        <button 
          onClick={getRandomQuote}
          className="text-sm text-accent hover:text-accent-focus transition-colors"
        >
          Get another quote
        </button>
      </CardContent>
    </Card>
  );
}
