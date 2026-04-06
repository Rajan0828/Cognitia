import { useState, useEffect } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/Common/Spinner";
import Button from "../../components/Common/Button";
import DocumentCard from "../../components/Documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectDocument, setSelectDocument] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to load documents");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension for title
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please select a file and enter a title");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Failed to upload document");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (document) => {
    setSelectDocument(document);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectDocument) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectDocument._id);
      toast.success(`Document ${selectDocument.title} deleted successfully`);
      setIsDeleteModalOpen(false);
      setSelectDocument(null);
      setDocuments(documents.filter((doc) => doc._id !== selectDocument._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      );
    }
    if (documents.length === 0) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50">
              <FileText
                className="h-10 w-10 text-slate-400"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="mb-2 text-xl font-medium tracking-tight text-slate-900">
              No Documents Found
            </h3>
            <p className="mb-6 text-slate-500">
              You haven't uploaded any documents yet. Click the button below to
              get started.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Upload Document
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {documents?.map((document) => (
          <DocumentCard
            key={document._id}
            document={document}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* SUBTLE BACKGROUND PATTERN */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30" />
      <div className="relative max-w-7xl">
        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-medium tracking-tight text-slate-900">
              My Documents
            </h1>
            <p className="text-sm text-slate-500">
              Manage your uploaded documents here
            </p>
          </div>
          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>
        {renderContent()}
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
        <div className="border=slate-200 relative w-full max-w-lg rounded-2xl border bg-white/95 p-6 shadow-2xl shadow-slate-900/20 backdrop-blur-xl">
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {/* MODAL HEADER */}
          <div className="mb-6">
            <h2 className="text-xl font-medium tracking-tight text-slate-900">
              Upload Document
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a file from your computer to upload. Supported formats
              include PDF, DOCX, and TXT. After uploading, you can manage your
              documents and view their details.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleUpload} className="space-y-5">
            {/* TITLE INPUT */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wide text-slate-700 uppercase">
                Document Title
              </label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10 focus:outline-none"
                placeholder="Enter document title"
              />
            </div>

            {/* FILE UPLOAD */}
            <div className="">
              <label className="">PDF File</label>
              <div className="">
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  required
                  className=""
                />
                <div className="">
                  <div className="">
                    <Upload className="" strokeWidth={2} />
                  </div>
                  <p className="">
                    {uploadFile ? (
                      <span>{uploadFile.name}</span>
                    ) : (
                      <>
                        {" "}
                        <span className="">Click to upload a file</span>
                        {""}or drag and drop
                      </>
                    )}
                  </p>
                  <p className="">PDF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                disabled={uploading}
                className=""
              >
                Cancel
              </button>
              <button type="submit" disabled={uploading} className="">
                {uploading ? (
                  <span className="">
                    {" "}
                    <div className="" /> Uploading...{" "}
                  </span>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentListPage;
