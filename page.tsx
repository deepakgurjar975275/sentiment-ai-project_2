"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { URLInput } from "@/components/dashboard/url-input";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { SentimentCharts } from "@/components/dashboard/sentiment-charts";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { CommentsSection } from "@/components/dashboard/comments-section";
import { Chatbot } from "@/components/dashboard/chatbot";


// Mock data for demonstration
const mockKPIData = {
  totalComments: 1247,
  positiveCount: 687,
  negativeCount: 234,
  neutralCount: 326,
  positivePercent: 55.1,
  negativePercent: 18.8,
  neutralPercent: 26.1,
};

const mockChartData = {
  sentimentDistribution: [
    { name: "Positive", value: 687, color: "hsl(var(--chart-1))" },
    { name: "Negative", value: 234, color: "hsl(var(--chart-2))" },
    { name: "Neutral", value: 326, color: "hsl(var(--chart-3))" },
  ],
  topKeywords: [
    { keyword: "amazing", count: 156 },
    { keyword: "helpful", count: 134 },
    { keyword: "quality", count: 98 },
    { keyword: "recommend", count: 89 },
  ],
  sentimentOverTime: [
    { date: "Mon", positive: 85, negative: 32, neutral: 45 },
    { date: "Tue", positive: 92, negative: 28, neutral: 52 },
    { date: "Wed", positive: 78, negative: 45, neutral: 38 },
    { date: "Thu", positive: 105, negative: 22, neutral: 48 },
    { date: "Fri", positive: 118, negative: 35, neutral: 55 },
    { date: "Sat", positive: 95, negative: 38, neutral: 42 },
    { date: "Sun", positive: 114, negative: 34, neutral: 46 },
  ],
};

const mockInsights = {
  summary:
    "Overall sentiment is predominantly positive with 55% of comments expressing satisfaction. The video has strong engagement with key themes around product quality and helpfulness. There is a notable concern about delivery times that could be addressed.",
  insights: [
    {
      type: "positive" as const,
      title: "Strong Positive Engagement",
      description: "55% of comments express positive sentiment, indicating high viewer satisfaction.",
    },
    {
      type: "trend" as const,
      title: "Growing Interest",
      description: "Comment volume increased by 23% compared to the previous week.",
    },
    {
      type: "warning" as const,
      title: "Delivery Concerns",
      description: "18% of negative comments mention shipping or delivery delays.",
    },
    {
      type: "suggestion" as const,
      title: "Engagement Opportunity",
      description: "Consider responding to neutral comments to convert them into positive engagement.",
    },
  ],
};

const mockComments = [
  {
    id: "1",
    author: "Sarah Johnson",
    avatar: "",
    text: "This is exactly what I was looking for! The quality exceeded my expectations and the customer service was fantastic.",
    sentiment: "positive" as const,
    confidence: 0.94,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    author: "Mike Chen",
    avatar: "",
    text: "Decent product but the shipping took longer than expected. Would appreciate faster delivery options.",
    sentiment: "negative" as const,
    confidence: 0.78,
    timestamp: "3 hours ago",
  },
  {
    id: "3",
    author: "Emily Davis",
    avatar: "",
    text: "I have some questions about the warranty. Can someone help clarify the return policy?",
    sentiment: "neutral" as const,
    confidence: 0.85,
    timestamp: "4 hours ago",
  },
  {
    id: "4",
    author: "Alex Thompson",
    avatar: "",
    text: "Absolutely love this! Best purchase I have made this year. Already recommended it to all my friends.",
    sentiment: "positive" as const,
    confidence: 0.97,
    timestamp: "5 hours ago",
  },
  {
    id: "5",
    author: "Jordan Lee",
    avatar: "",
    text: "The product arrived damaged. Very disappointed with the packaging quality.",
    sentiment: "negative" as const,
    confidence: 0.91,
    timestamp: "6 hours ago",
  },
  {
    id: "6",
    author: "Chris Wilson",
    avatar: "",
    text: "Works as described. Nothing special but gets the job done.",
    sentiment: "neutral" as const,
    confidence: 0.72,
    timestamp: "7 hours ago",
  },
];

export default function Dashboard() {
  
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const handleLogin = async () => {
  const res = await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  if (res.status === 200) {
    setIsLoggedIn(true);
  } else {
    alert("Invalid login");
  }
};
const generateKPI = (data: any[]) => {

 
  const total = data.length;

  const positive = data.filter(d => d.sentiment === "positive").length;
  const negative = data.filter(d => d.sentiment === "negative").length;
  const neutral = data.filter(d => d.sentiment === "neutral").length;

  return [
    {
      title: "Total Comments",
      value: total,
      change: "+0%",
      icon: "MessageSquare"
    },
    {
      title: "Positive",
      value: positive,
      change: "+0%",
      icon: "TrendingUp"
    },
    {
      title: "Negative",
      value: negative,
      change: "+0%",
      icon: "TrendingDown"
    },
    {
      title: "Neutral",
      value: neutral,
      change: "+0%",
      icon: "Minus"
    }
  ];
};
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [realData, setRealData] = useState<any[]>([]);

  const handleAnalyze = async (url: string) => {
  setIsAnalyzing(true);

  try {
    // ✅ Extract video ID safely
    const videoId = url.includes("v=")
      ? url.split("v=")[1].split("&")[0]
      : url;

    console.log("Video ID:", videoId);

    const response = await fetch("http://127.0.0.1:5000/analyze", {
  method: "POST",   // ✅ MUST BE THIS
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ video_id: videoId })
});

    const data = await response.json();

    console.log("Backend Data:", data);

    // ✅ Format data for UI
    const formatted = data.map((item: any, index: number) => ({
      id: index.toString(),
      author: "User",
      avatar: "",
      text: item.comment,
      sentiment: item.sentiment.toLowerCase(),

      score:
        item.sentiment === "POSITIVE"
          ? 1
          : item.sentiment === "NEGATIVE"
          ? -1
          : 0,

      confidence: 0.9,
      timestamp: "now"
    }));

    setRealData(formatted);

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Check backend.");
  }

  setIsAnalyzing(false);
  setHasAnalyzed(true);
};

const words = realData
  .map(d => d.text)
  .join(" ")
  .split(" ")
  .slice(0, 10);


  if (!isLoggedIn) {
  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
  return (
    
    
    <div className="min-h-screen bg-background">
      {/* Animated background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-neon-pink/15 blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-neon-purple/15 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-40 right-1/4 h-[450px] w-[450px] rounded-full bg-neon-cyan/15 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-neon-green/10 blur-[80px] animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <Header />

        <div className="space-y-8">
          <URLInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

          {hasAnalyzed && (
            <>
              <KPICards 

  data={{
    totalComments: realData.length,
    positiveCount: realData.filter(d => d.sentiment === "positive").length,
    negativeCount: realData.filter(d => d.sentiment === "negative").length,
    neutralCount: realData.filter(d => d.sentiment === "neutral").length,

    positivePercent: realData.length === 0 ? 0 :
      (realData.filter(d => d.sentiment === "positive").length / realData.length) * 100,

    negativePercent: realData.length === 0 ? 0 :
      (realData.filter(d => d.sentiment === "negative").length / realData.length) * 100,

    neutralPercent: realData.length === 0 ? 0 :
      (realData.filter(d => d.sentiment === "neutral").length / realData.length) * 100
  }} 
/>
              <SentimentCharts 
              
  data={{
    topKeywords: realData
  .map(d => d.text)
  .join(" ")
  .toLowerCase()
  .split(" ")
  .slice(0, 8)
  .map((word, index) => ({
    keyword: word,
    count: realData.filter(d => d.text.toLowerCase().includes(word)).length
  })),
    sentimentDistribution: [
      {
        name: "Positive",
        value: realData.filter(d => d.sentiment === "positive").length
      },
      {
        name: "Negative",
        value: realData.filter(d => d.sentiment === "negative").length
      },
      {
        name: "Neutral",
        value: realData.filter(d => d.sentiment === "neutral").length
      }
    ],

  sentimentOverTime: realData.map((item, index) => ({
  date: `#${index + 1}`,
  positive: item.sentiment === "positive" ? 1 : 0,
  negative: item.sentiment === "negative" ? 1 : 0,
  neutral: item.sentiment === "neutral" ? 1 : 0
})),

    emotionData: [
      { name: "Positive", value: realData.filter(d => d.sentiment === "positive").length },
      { name: "Negative", value: realData.filter(d => d.sentiment === "negative").length },
      { name: "Neutral", value: realData.filter(d => d.sentiment === "neutral").length }
    ]
  } as any}
/>
              <div style={{ marginTop: "20px" }}>
  <h3>🔥 Trending Words</h3>

  {words.map((w, i) => (
    <span key={i} style={{ marginRight: "10px" }}>
      {w}
    </span>
  ))}
</div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <AIInsights 
  insights={[
  {
    text: `Total comments analyzed: ${realData.length}`,
    type: "neutral"
  },
  {
    text: `Audience shows strong engagement`,
    type: "neutral"
  },
  {
    text: `Some negative feedback detected`,
    type: "neutral"
  }
  
] as any}
  summary={`
Out of ${realData.length} comments analyzed:

• ${
  realData.filter(d => d.sentiment === "positive").length
} show positive reactions 😊

• ${
  realData.filter(d => d.sentiment === "negative").length
} express concerns or dissatisfaction 😡

• ${
  realData.filter(d => d.sentiment === "neutral").length
} are neutral or informational 😐

Overall audience sentiment is ${
  realData.filter(d => d.sentiment === "positive").length >
  realData.filter(d => d.sentiment === "negative").length
    ? "strongly positive with high engagement 🚀"
    : "mixed with noticeable negative feedback ⚠️"
}.
`}
/>
                <CommentsSection comments={realData} />
              </div>
            </>
          )}
        </div>
      </main>

      <Chatbot />
    </div>
  );
}
