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
      toast.success(`Document ${selectDocument.title} has been deleted`);
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
        <div className="flex min-h-100 items-center justify-center">
          <Spinner />
        </div>
      );
    }
    if (documents.length === 0) {
      return (
        <div className="flex min-h-100 items-center justify-center">
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

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-900/20 backdrop-blur-xl">
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
                Select a pdf file from your computer to upload.
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
              <div className="space-y-2">
                <label className="block text-xs font-semibold tracking-wide text-slate-700 uppercase">
                  PDF File
                </label>
                <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50/30">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="flex flex-col items-center justify-center px-6 py-10">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-r from-emerald-100 to-teal-100">
                      <Upload
                        className="h-7 w-7 text-emerald-600"
                        strokeWidth={2}
                      />
                    </div>
                    <p className="mb-1 text-sm font-medium text-slate-700">
                      {uploadFile ? (
                        <span>{uploadFile.name}</span>
                      ) : (
                        <>
                          {" "}
                          <span className="text-emerald-600">
                            Click to upload a file
                          </span>
                          {""} or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">PDF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="h-11 flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="h-11 flex-1 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      {" "}
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />{" "}
                      Uploading...{" "}
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/95 p-8 shadow-2xl shadow-slate-900/20 backdrop-blur-xl">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* MODAL HEADER */}
            <div className="mb-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-red-100 to-red-200">
                <Trash2 className="h-6 w-6 text-red-600" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-medium tracking-tight text-slate-900">
                Confirm Delete
              </h2>
            </div>

            {/* MODAL BODY */}
            <p className="mb-2 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {selectDocument?.title}
              </span>
              ?
            </p>
            <p className="mb-6 text-sm text-red-500">
              <span className="font-semibold">Warning:</span> This action cannot
              be undone.
            </p>

            {/* ACTION BUTTON */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
                className="h-11 flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="h-11 flex-1 rounded-xl bg-linear-to-r from-red-500 to-red-600 px-4 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-200 hover:from-red-600 hover:to-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
