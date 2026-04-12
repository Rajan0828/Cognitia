import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/Common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/Common/PageHeader";
import Tabs from "../../components/Common/Tabs";
import ChatInterface from "../../components/Chat/ChatInterface";

const DocumentsDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // Get full PDF URL
  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath; // Already a full URL
    }

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!document || !document.data || !document.data.filePath) {
      return <div className="p-8 text-center">PDF document not found.</div>;
    }

    const pdfUrl = getPdfUrl();
    return (
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 p-4">
          <span className="text-sm font-medium text-gray-700">
            Document Viewer
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
        <div className="bg-gray-100 p-1">
          <iframe
            src={pdfUrl}
            className="h-[70vh] w-full rounded border-0 border-gray-300 bg-white"
            title="PDF Viewer"
            style={{
              colorScheme: "light",
            }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />;
  };

  const renderAiActions = () => {
    return "renderAiActions";
  };

  const renderFlashcardsTab = () => {
    return "rederFlashcardsTab";
  };

  const renderQuizzesTab = () => {
    return "renderQuizzesTab";
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAiActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return <div className="p-8 text-center">Document not found.</div>;
  }

  return (
    <div>
      <div className="">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
      <PageHeader title={document.data.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentsDetailPage;
