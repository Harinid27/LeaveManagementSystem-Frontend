import { useState } from "react";
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Download
} from "lucide-react";
import { userService } from "../services/userService.js";
import { toast } from "react-hot-toast";

const ImportUsersModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid CSV file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await userService.bulkImportUsers(file);
      setResult(res.summary);
      toast.success(res.message);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload users");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ["name", "email", "role", "department", "reportingToEmail"];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" +
      "John Doe,john@example.com,student,Computer Science,professor@example.com";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bulk Import Users</h2>
            <p className="text-xs font-medium text-gray-500 mt-1">Create multiple accounts using a CSV file</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100 shadow-sm shadow-transparent hover:shadow-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {!result ? (
            <>
              {/* Upload Zone */}
              <div 
                className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all ${file ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile.name.endsWith('.csv')) setFile(droppedFile);
                }}
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-transform duration-500 ${file ? 'bg-indigo-600 text-white scale-110' : 'bg-white text-gray-400'}`}>
                  {file ? <FileText className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                </div>
                
                {file ? (
                  <div className="space-y-2">
                    <p className="font-bold text-gray-900 text-xl">{file.name}</p>
                    <p className="text-xs font-medium text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    <button onClick={() => setFile(null)} className="text-indigo-600 text-sm font-bold mt-4 hover:underline">Change File</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="font-black text-gray-900 text-xl">Drag & Drop CSV</p>
                      <p className="text-sm font-medium text-gray-500 mt-2">or click to browse from your computer</p>
                    </div>
                    <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" />
                    <label htmlFor="csv-upload" className="cursor-pointer inline-block px-8 py-3.5 bg-white border border-gray-100 rounded-2xl font-bold text-gray-900 text-sm shadow-sm hover:shadow-indigo-100 transition-all hover:-translate-y-0.5 mt-2">
                      Browse Files
                    </label>
                  </div>
                )}
              </div>

              {/* Template Section */}
              <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 font-bold border border-indigo-100">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Need a template?</p>
                    <p className="text-xs font-medium text-indigo-600/70">Required headers: name, email, role, dept...</p>
                  </div>
                </div>
                <button onClick={handleDownloadTemplate} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Get Template
                </button>
              </div>

              <div className="pt-4 flex gap-4">
                 <button onClick={onClose} className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all text-sm">Cancel</button>
                 <button 
                  onClick={handleUpload} 
                  disabled={!file || uploading} 
                  className={`flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:translate-y-0 hover:-translate-y-1 flex items-center justify-center gap-2`}
                 >
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /> Import Now</>}
                 </button>
              </div>
            </>
          ) : (
            /* Results View */
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
               <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Import Complete</h3>
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs ring-1 ring-emerald-100">
                      {result.success} Success
                    </div>
                    <div className="px-4 py-2 bg-red-50 text-red-700 rounded-xl font-bold text-xs ring-1 ring-red-100">
                      {result.failed} Failed
                    </div>
                  </div>
               </div>

               <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {result.details.map((detail, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between text-sm ${detail.status === 'success' ? 'bg-emerald-50/30 border-emerald-100/50 text-emerald-800' : 'bg-red-50/30 border-red-100/50 text-red-800'}`}>
                      <div className="flex items-center gap-3">
                        {detail.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="font-bold truncate max-w-[200px]">{detail.email}</span>
                      </div>
                      <span className="text-[10px] uppercase font-black tracking-widest">{detail.status}</span>
                    </div>
                  ))}
               </div>

               <button 
                onClick={onClose} 
                className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl shadow-gray-200 hover:bg-black transition-all"
               >
                 Close & Refresh List
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportUsersModal;
