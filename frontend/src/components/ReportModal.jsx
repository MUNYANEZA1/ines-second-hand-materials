// src/components/ReportModal.jsx
import { useState } from 'react';

const ReportModal = ({ isOpen, onClose, onSubmit, type, targetId, targetName }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for reporting');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      let reportData = { reason };
      
      if (type === 'user') {
        reportData.target_user_id = targetId;
      } else if (type === 'item') {
        reportData.item_id = targetId;
      }
      
      await onSubmit(reportData);
      setReason('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          Report {type === 'user' ? 'User' : 'Item'}
        </h3>
        
        <p className="mb-4">
          You are reporting {type === 'user' ? 'user' : 'item'}: <span className="font-semibold">{targetName}</span>
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
              Reason for Reporting*
            </label>
            <textarea
              id="reason"
              name="reason"
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Please provide details about why you're reporting this content..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;

