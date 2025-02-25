import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProxyRequest {
  action: string;
  environment: string;
  policy: string;
  source: string;
  destinations: string;
  notes: string;
  jira: string;
  status: string;
  createdAt: string;
}

export default function ProxyRequestForm() {
  const [requests, setRequests] = useState<ProxyRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<ProxyRequest>({
    action: "add",
    environment: "Cloud",
    policy: "",
    source: "",
    destinations: "",
    notes: "",
    jira: "",
    status: "pending",
    createdAt: new Date().toISOString()
  });
  const [selectedRequest, setSelectedRequest] = useState<ProxyRequest | null>(null);

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "implemented", label: "Implemented", color: "bg-green-500" }
  ];

  const getJiraUrl = (jiraId: string) => {
    return `https://jira.company.com/browse/${jiraId}`;
  };

  useEffect(() => {
    const savedRequests = localStorage.getItem("proxyRequests");
    if (savedRequests) {
      try {
        setRequests(JSON.parse(savedRequests));
      } catch (e) {
        console.error("Error parsing saved requests:", e);
        setRequests([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("draftRequest", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      ...formData,
      createdAt: new Date().toISOString()
    };
    const newRequests = [...requests, newRequest];
    setRequests(newRequests);
    localStorage.setItem("proxyRequests", JSON.stringify(newRequests));
    setFormData({
      action: "add",
      environment: "Cloud",
      policy: "",
      source: "",
      destinations: "",
      notes: "",
      jira: "",
      status: "pending",
      createdAt: new Date().toISOString()
    });
  };

  const handleSelectRequest = (index: number) => {
    setSelectedRequest(requests[index]);
  };

  const handleStatusChange = (requestIndex: number, newStatus: string) => {
    const updatedRequests = [...requests];
    updatedRequests[requestIndex] = {
      ...updatedRequests[requestIndex],
      status: newStatus
    };
    setRequests(updatedRequests);
    localStorage.setItem("proxyRequests", JSON.stringify(updatedRequests));

    if (selectedRequest && selectedRequest === requests[requestIndex]) {
      setSelectedRequest(updatedRequests[requestIndex]);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || "bg-gray-500";
  };

  const filteredRequests = requests.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.policy.toLowerCase().includes(searchLower) ||
      request.jira.toLowerCase().includes(searchLower) ||
      request.environment.toLowerCase().includes(searchLower) ||
      request.action.toLowerCase().includes(searchLower) ||
      request.source.toLowerCase().includes(searchLower) ||
      request.destinations.toLowerCase().includes(searchLower) ||
      request.notes.toLowerCase().includes(searchLower)
    );
  });

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

      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold">Past Requests</h3>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ul className="space-y-2">
          {filteredRequests.map((req, index) => (
            <li key={index} className="p-4 border rounded bg-muted text-muted-foreground hover:bg-muted/80">
              <div className="flex justify-between items-start mb-2">
                <div className="cursor-pointer" onClick={() => handleSelectRequest(index)}>
                  <p className="font-medium">{req.action} to {req.environment} - {req.policy}</p>
                  <p className="text-sm">
                    JIRA: {req.jira && (
                      <a 
                        href={getJiraUrl(req.jira)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {req.jira}
                      </a>
                    )}
                  </p>
                </div>
                <select
                  value={req.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                  className="ml-2 p-1 rounded bg-background text-foreground border"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Badge className={`${getStatusBadgeColor(req.status)} text-white`}>
                {statusOptions.find(opt => opt.value === req.status)?.label || "Unknown"}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      {selectedRequest && (
        <div className="mt-4 p-4 border rounded bg-muted text-muted-foreground">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Request Details</h3>
            <Badge className={`${getStatusBadgeColor(selectedRequest.status)} text-white`}>
              {statusOptions.find(opt => opt.value === selectedRequest.status)?.label || "Unknown"}
            </Badge>
          </div>
          <p>
            <strong>JIRA Story #:</strong>{" "}
            {selectedRequest.jira && (
              <a 
                href={getJiraUrl(selectedRequest.jira)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {selectedRequest.jira}
              </a>
            )}
          </p>
          <p><strong>Action:</strong> {selectedRequest.action}</p>
          <p><strong>Environment:</strong> {selectedRequest.environment}</p>
          <p><strong>Policy:</strong> {selectedRequest.policy}</p>
          <p><strong>Source:</strong> {selectedRequest.source}</p>
          <p><strong>Destinations:</strong> {selectedRequest.destinations}</p>
          <p><strong>Notes:</strong> {selectedRequest.notes}</p>
          <p><strong>Created:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
        </div>
      )}
    </Card>
  );
}