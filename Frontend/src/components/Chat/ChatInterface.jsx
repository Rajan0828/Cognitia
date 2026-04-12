import React from "react";
import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Common/Spinner";
import MarkdownRenderer from "../../components/Common/MarkdownRenderer";
import aiService from "../../services/aiService";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setHistory((prevHistory) => [...prevHistory, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);
      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks,
      };
      setHistory((prevHistory) => [...prevHistory, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      };
      setHistory((prevHistory) => [...prevHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`my-4 flex items-start gap-3 ${isUser ? "justify-end" : ""}`}
      >
        {!isUser && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg drop-shadow-emerald-500/25">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
        )}
        <div
          className={`max-2-lg rounded-2xl p-4 shadow-sm ${
            isUser
              ? "rounded-br-md bg-linear-to-br from-emerald-500 to-teal-500 text-white"
              : "rounded-bl-md border border-slate-200/60 bg-white text-slate-800 "
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{msg.content}</p>
          ) : (
            <div className="prose prose-sm prose-slate max-w-none">
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>
        {isUser && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-200 to-slate-300 text-sm font-semibold text-slate-700 shadow-sm">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center rounded-2xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100">
          <MessageSquare className="h-7 w-7 text-emerald-600" strokeWidth={2} />
        </div>
        <Spinner />
        <p className="mt-3 text-sm font-medium text-slate-500">
          Loading chat history...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
      {/* MESSAGE AREA */}
      <div className="flex-1 overflow-y-auto bg-linear-to-br from-slate-50/50 via-white/50 to-slate-50/50 p-6">
        {history.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/10">
              <MessageSquare
                className="h-8 w-8 text-emerald-600"
                strokeWidth={2}
              />
            </div>
            <h3 className="mb-2 text-base font-semibold text-slate-900">
              Start a conversation
            </h3>
            <p className="text-sm text-slate-500">
              Ask me anything about the document!
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}
        <div ref={messageEndRef} />
        {loading && (
          <div className="my-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200/60 bg-white px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "0ms" }}
                >
                  {" "}
                </span>
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "150ms" }}
                >
                  {" "}
                </span>
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "300ms" }}
                >
                  {" "}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="border-t border-slate-200/60 bg-white/80 p-5">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="h-12 flex-1 rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-5 w-5" strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
