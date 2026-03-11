import { useState, useEffect } from 'react';
import axios from 'axios';

interface Job {
  id: string;
  company_name: string;
  role_title: string;
  status: 'pending' | 'interview' | 'rejected' | 'accepted' | 'withdrawn';
  platform?: string;
  job_url?: string;
  applied_at: string;
  notes?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USER_ID = 'demo-user-123';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    roleTitle: '',
    status: 'pending',
    platform: '',
    jobUrl: '',
    notes: '',
  });

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`, {
        headers: { 'x-user-id': USER_ID },
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/jobs`, formData, {
        headers: { 'x-user-id': USER_ID },
      });
      setFormData({
        companyName: '',
        roleTitle: '',
        status: 'pending',
        platform: '',
        jobUrl: '',
        notes: '',
      });
      setShowForm(false);
      fetchJobs();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(
        `${API_URL}/jobs/${id}`,
        { status },
        {
          headers: { 'x-user-id': USER_ID },
        }
      );
      fetchJobs();
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`${API_URL}/jobs/${id}`, {
        headers: { 'x-user-id': USER_ID },
      });
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    interview: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Tracker</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add Job'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow mb-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Company Name *"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Role Title *"
                value={formData.roleTitle}
                onChange={(e) =>
                  setFormData({ ...formData, roleTitle: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <select
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Select Platform</option>
                <option value="linkedin">LinkedIn</option>
                <option value="indeed">Indeed</option>
                <option value="jobstreet">JobStreet</option>
                <option value="other">Other</option>
              </select>
              <input
                type="url"
                placeholder="Job URL"
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="border p-2 rounded col-span-2"
                rows={2}
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Save Job Application
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500">
            No job applications yet. Add your first one!
          </p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-4">Company</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Platform</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Applied</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t">
                    <td className="p-4 font-medium">{job.company_name}</td>
                    <td className="p-4">{job.role_title}</td>
                    <td className="p-4 capitalize">{job.platform || '-'}</td>
                    <td className="p-4">
                      <select
                        value={job.status}
                        onChange={(e) => updateStatus(job.id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm ${statusColors[job.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="interview">Interview</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(job.applied_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {job.job_url && (
                        <a
                          href={job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mr-3"
                        >
                          View
                        </a>
                      )}
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
