import { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

import documentService from '../../services/documentService';
import Spinner from '../../components/Common/Spinner';
import Button from '../../components/Common/Button';
import DocumentCard from '../../components/Documents/DocumentCard';

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [upoading, setUploading] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectDocument, setSelectDocument] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error('Failed to load documents');
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
      setUploadTitle(file.name.replace(/\.[^/.]+$/, '')); // Remove file extension for title
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error('Please select a file and enter a title');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success('Document uploaded successfully');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle('');
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || 'Failed to upload document');
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
      toast.error(error.message || 'Failed to delete document');
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex items-center justify-center min-h-[400px]'>
          <Spinner />
        </div>
      );
    }
    if (documents.length === 0) {
      return (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center max-w-md'>
            <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-6'>
              <FileText
                className='w-10 h-10 text-slate-400'
                strokeWidth={1.5}
              />
            </div>
            <h3 className='text-xl font-medium text-slate-900 tracking-tight mb-2'>No Documents Found</h3>
            <p className='text-slate-500 mb-6'>You haven't uploaded any documents yet. Click the button below to get started.</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className='inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]'
            >
              <Plus
                className='w-4 h-4'
                strokeWidth={2.5}
              />
              Upload Document
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
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
    <div className='min-h-screen'>
      {/* SUBTLE BACKGROUND PATTERN */}
      <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none' />
      <div className='relative max-w-7xl '>
        {/* HEADER */}
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>My Documents</h1>
            <p className=''>Manage your uploaded documents here</p>
          </div>
          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus
                className='text-slate-500 text-sm'
                strokeWidth={2.5}
              />
              Upload Document
            </Button>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DocumentListPage;
