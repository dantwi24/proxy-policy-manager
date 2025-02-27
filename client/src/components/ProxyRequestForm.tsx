
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "./ui/textarea";

// Enum for Status
enum Status {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  InProgress = "In Progress"
}

// Interface for Request
interface RequestData {
  id: string;
  action: string;
  environment: string;
  policy: string;
  source: string;
  destinations: string;
  notes: string;
  jira: string;
  status: Status;
  createdAt: string;
  submittedAt: string;
  history: any[];
}

export default function ProxyRequestForm() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [formData, setFormData] = useState<RequestData>({
    id: uuidv4(),
    action: "add",
    environment: "Cloud",
    policy: "",
    source: "",
    destinations: "",
    notes: "",
    jira: "",
    status: Status.Pending,
    createdAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    history: []
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Add new request to the list
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequests([
      ...requests,
      { ...formData, id: uuidv4(), createdAt: new Date().toISOString() },
    ]);
    setFormData({
      id: uuidv4(),
      action: "add",
      environment: "Cloud",
      policy: "",
      source: "",
      destinations: "",
      notes: "",
      jira: "",
      status: Status.Pending,
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      history: [],
    });
  };

  return (
    <div>
      <h1>Proxy Policy Change Requests</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="action">Action:</label>
          <select
            id="action"
            name="action"
            value={formData.action}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          >
            <option value="add">Add</option>
            <option value="remove">Remove</option>
            <option value="modify">Modify</option>
          </select>
        </div>

        <div>
          <label htmlFor="environment">Environment:</label>
          <select
            id="environment"
            name="environment"
            value={formData.environment}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          >
            <option value="Cloud">Cloud</option>
            <option value="On-Premise">On-Premise</option>
          </select>
        </div>

        <div>
          <label htmlFor="policy">Policy:</label>
          <input
            type="text"
            id="policy"
            name="policy"
            value={formData.policy}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="source">Source:</label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="destinations">Destinations:</label>
          <input
            type="text"
            id="destinations"
            name="destinations"
            value={formData.destinations}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="jira">JIRA Ticket:</label>
          <input
            type="text"
            id="jira"
            name="jira"
            value={formData.jira}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="notes">Notes:</label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Request
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Recent Requests</h2>
        <div className="space-y-4 mt-4">
          {requests.map((request) => (
            <div key={request.id} className="p-4 border rounded">
              <p>Action: {request.action}</p>
              <p>Environment: {request.environment}</p>
              <p>Policy: {request.policy}</p>
              <p>Source: {request.source}</p>
              <p>Destinations: {request.destinations}</p>
              <p>Status: {request.status}</p>
              <p>Created: {new Date(request.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
