import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique id generation

// Enum for Status
enum Status {
  Pending = "Pending",
  Approved = "Approved",
  Denied = "Denied",
}

// Interface for ProxyRequest
interface ProxyRequest {
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

const App = () => {
  const [formData, setFormData] = useState<ProxyRequest>({
    id: uuidv4(), // Use UUID for the initial ID
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

  const [requests, setRequests] = useState<ProxyRequest[]>([]);

  // Load existing proxy requests from localStorage
  useEffect(() => {
    const storedRequests = localStorage.getItem("proxyRequests");
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
  }, []);

  // Save requests to localStorage whenever requests state changes
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem("proxyRequests", JSON.stringify(requests));
    }
  }, [requests]);

  // Handling form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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

      <form onSubmit={handleSubmit}>
        <label>
          Action:
          <input
            type="text"
            name="action"
            value={formData.action}
            onChange={handleChange}
          />
        </label>
        <label>
          Environment:
          <input
            type="text"
            name="environment"
            value={formData.environment}
            onChange={handleChange}
          />
        </label>
        <label>
          Policy:
          <input
            type="text"
            name="policy"
            value={formData.policy}
            onChange={handleChange}
          />
        </label>
        <label>
          Source:
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
          />
        </label>
        <label>
          Destinations:
          <input
            type="text"
            name="destinations"
            value={formData.destinations}
            onChange={handleChange}
          />
        </label>
        <label>
          Notes:
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>
        <label>
          Jira:
          <input
            type="text"
            name="jira"
            value={formData.jira}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit Request</button>
      </form>

      <h2>Previous Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <p>Action: {request.action}</p>
            <p>Environment: {request.environment}</p>
            <p>Status: {request.status}</p>
            <p>Created At: {new Date(request.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;