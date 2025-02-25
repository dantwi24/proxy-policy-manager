import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

export default function ProxyRequestForm() {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    action: "add",
    environment: "Cloud",
    policy: "",
    source: "",
    destinations: "",
    notes: "",
    jira: ""
  });
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem("proxyRequests")) || [];
    setRequests(savedRequests);
  }, []);

  useEffect(() => {
    localStorage.setItem("draftRequest", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequests = [...requests, formData];
    setRequests(newRequests);
    localStorage.setItem("proxyRequests", JSON.stringify(newRequests));
    setFormData({ action: "add", environment: "Cloud", policy: "", source: "", destinations: "", notes: "", jira: "" });
  };

  const handleSelectRequest = (index) => {
    setSelectedRequest(requests[index]);
  };

  return (
    <Card className="p-6 bg-card text-card-foreground">
      <h2 className="text-xl font-bold mb-4">Proxy Policy Change Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="action" value={formData.action} onChange={handleChange} className="w-full p-2 border rounded bg-background text-foreground">
          <option value="add">Add</option>
          <option value="remove">Remove</option>
          <option value="modify">Modify</option>
        </select>
        <select name="environment" value={formData.environment} onChange={handleChange} className="w-full p-2 border rounded bg-background text-foreground">
          <option value="Cloud">Cloud</option>
          <option value="On-Prem">On-Prem</option>
        </select>
        <input type="text" name="policy" placeholder="Policy Name" value={formData.policy} onChange={handleChange} className="w-full p-2 border rounded bg-background text-foreground" required />
        <input type="text" name="source" placeholder="Source (optional)" value={formData.source} onChange={handleChange} className="w-full p-2 border rounded bg-background text-foreground" />
        <textarea name="destinations" placeholder="Destinations" value={formData.destinations} onChange={handleChange} className="w-full p-2 border rounded bg-background text-foreground" required></textarea>
        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className="w-full p-2 border rounded bg-background text-foreground"></textarea>
        <input type="text" name="jira" placeholder="JIRA Story #" value={formData.jira} onChange={handleChange} className="w-full p-2 border rounded bg-background text-foreground" />
        <button type="submit" className="w-full p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">Submit Request</button>
      </form>
      
      <h3 className="text-lg font-bold mt-6">Past Requests</h3>
      <ul className="mt-2 space-y-2">
        {requests.map((req, index) => (
          <li key={index} className="p-2 border rounded bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80" onClick={() => handleSelectRequest(index)}>
            {req.action} to {req.environment} - {req.policy} (JIRA: {req.jira})
          </li>
        ))}
      </ul>
      
      {selectedRequest && (
        <div className="mt-4 p-4 border rounded bg-muted text-muted-foreground">
          <h3 className="text-lg font-bold">JIRA Story #: {selectedRequest.jira}</h3>
          <p><strong>Action:</strong> {selectedRequest.action}</p>
          <p><strong>Environment:</strong> {selectedRequest.environment}</p>
          <p><strong>Policy:</strong> {selectedRequest.policy}</p>
          <p><strong>Source:</strong> {selectedRequest.source}</p>
          <p><strong>Destinations:</strong> {selectedRequest.destinations}</p>
          <p><strong>Notes:</strong> {selectedRequest.notes}</p>
        </div>
      )}
    </Card>
  );
}
