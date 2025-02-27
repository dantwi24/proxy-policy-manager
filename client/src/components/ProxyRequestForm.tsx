import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Edit2, History } from "lucide-react";

interface ProxyRequest {
  id: string;
  action: string;
  environment: string;
  policy: string;
  source: string;
  destinations: string;
  notes: string;
  jira: string;
  status: string;
  createdAt: string;
  submittedAt: string; // Add submittedAt field
  history?: {
    timestamp: string;
    action: "create" | "edit" | "delete";
    changes?: Partial<ProxyRequest>;
  }[];
}

export default function ProxyRequestForm() {
  const [requests, setRequests] = useState<ProxyRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<ProxyRequest>({
    id: crypto.randomUUID(),
    action: "",
    environment: "",
    policy: "",
    source: "",
    destinations: "",
    notes: "",
    jira: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    //submittedAt: new Date().toISOString(), // Initialize submittedAt
    history: [],
  });
  const handleSubmitdate = () => {
    setFormData(prevState => ({
      ...prevState,
      submittedAt: new Date().toISOString(),
    }));

    // Handle form submission logic here...
  };
  const [selectedRequest, setSelectedRequest] = useState<ProxyRequest | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "implemented", label: "Implemented", color: "bg-green-500" },
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();

    if (isEditing && selectedRequest) {
      // Handle edit
      const updatedRequests = requests.map((req) => {
        if (req.id === selectedRequest.id) {
          const newHistory = [
            ...(req.history || []),
            {
              timestamp: currentDate,
              action: "edit",
              changes: {
                action:
                  formData.action !== req.action ? formData.action : undefined,
                environment:
                  formData.environment !== req.environment
                    ? formData.environment
                    : undefined,
                policy:
                  formData.policy !== req.policy ? formData.policy : undefined,
                source:
                  formData.source !== req.source ? formData.source : undefined,
                destinations:
                  formData.destinations !== req.destinations
                    ? formData.destinations
                    : undefined,
                notes:
                  formData.notes !== req.notes ? formData.notes : undefined,
                jira: formData.jira !== req.jira ? formData.jira : undefined,
              },
            },
          ];
          return {
            ...formData,
            id: req.id,
            submittedAt: currentDate,
            history: newHistory,
          }; //update submittedAt on edit
        }
        return req;
      });
      setRequests(updatedRequests);
      setIsEditing(false);
    } else {
      // Handle new request
      const newRequest = {
        ...formData,
        submittedAt: currentDate,
        history: [
          {
            timestamp: currentDate,
            action: "create",
          },
        ],
      };
      setRequests([...requests, newRequest]);
    }

    localStorage.setItem("proxyRequests", JSON.stringify(requests));
    setFormData({
      id: crypto.randomUUID(),
      action: "",
      environment: "",
      policy: "",
      source: "",
      destinations: "",
      notes: "",
      jira: "",
      status: "pending",
      createdAt: currentDate,
      submittedAt: currentDate,
      history: [],
    });
    setSelectedRequest(null);
  };

  const handleEdit = (request: ProxyRequest) => {
    setFormData(request);
    setSelectedRequest(request);
    setIsEditing(true);
  };

  const handleDelete = (requestId: string) => {
    const updatedRequests = requests.filter((req) => req.id !== requestId);
    setRequests(updatedRequests);
    localStorage.setItem("proxyRequests", JSON.stringify(updatedRequests));
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(null);
    }
  };

  const handleStatusChange = (requestId: string, newStatus: string) => {
    const updatedRequests = requests.map((req) => {
      if (req.id === requestId) {
        const newHistory = [
          ...(req.history || []),
          {
            timestamp: new Date().toISOString(),
            action: "edit",
            changes: { status: newStatus },
          },
        ];
        return { ...req, status: newStatus, history: newHistory };
      }
      return req;
    });
    setRequests(updatedRequests);
    localStorage.setItem("proxyRequests", JSON.stringify(updatedRequests));

    if (selectedRequest?.id === requestId) {
      setSelectedRequest(
        updatedRequests.find((r) => r.id === requestId) || null,
      );
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return (
      statusOptions.find((opt) => opt.value === status)?.color || "bg-gray-500"
    );
  };

  const groupRequestsByMonth = (requests: ProxyRequest[]) => {
    const grouped = requests.reduce(
      (acc, request) => {
        const date = new Date(request.createdAt);
        const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(request);
        return acc;
      },
      {} as Record<string, ProxyRequest[]>,
    );

    // Sort months in reverse chronological order
    return Object.entries(grouped).sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const filteredRequests = requests.filter((request) => {
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

  const groupedRequests = groupRequestsByMonth(filteredRequests);

  return (
    <Card className="p-6 bg-card text-card-foreground">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Edit Request" : "Proxy Policy Change Request"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="action"
          placeholder="Select Action"
          value={formData.action}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-background text-foreground"
        >
          <option value="add">Add</option>
          <option value="remove">Remove</option>
          <option value="modify">Modify</option>
          <option value="block">Block</option>
        </select>
        <select
          name="environment"
          placeholder="Environment"
          value={formData.environment}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-background text-foreground"
        >
          <option value="Cloud">Sophos</option>
          <option value="Ent Proxy/Cloud SWG">Ent Proxy/Cloud SWG</option>
        </select>
        <input
          type="text"
          name="policy"
          placeholder="Enter the policy name here"
          value={formData.policy}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-background text-foreground"
          required
        />
        <textarea
          name="source"
          placeholder="Sources (optional)"
          value={formData.source}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-background text-foreground"
        ></textarea>
        <textarea
          name="destinations"
          placeholder="Destinations"
          value={formData.destinations}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-background text-foreground"
          required
        ></textarea>
        <textarea
          name="notes"
          placeholder="Add any additional notes or context here"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-background text-foreground"
        ></textarea>
        <input
          type="text"
          name="jira"
          placeholder="JIRA Story #"
          value={formData.jira}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-background text-foreground"
        />
        <button
          type="submit"
          className="w-full p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          {isEditing ? "Save Changes" : "Submit Request"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setSelectedRequest(null);
              setFormData({
                id: crypto.randomUUID(),
                action: "add",
                environment: "Cloud",
                policy: "",
                source: "",
                destinations: "",
                notes: "",
                jira: "",
                status: "pending",
                createdAt: new Date().toISOString(),
                submittedAt: new Date().toISOString(),
                history: [],
              });
            }}
            className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600 mt-2"
          >
            Cancel Edit
          </button>
        )}
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

        <div className="space-y-6">
          {groupedRequests.map(([month, monthRequests]) => (
            <div key={month} className="space-y-2">
              <h4 className="font-semibold text-lg">{month}</h4>
              <ul className="space-y-2">
                {monthRequests.map((req) => (
                  <li
                    key={req.id}
                    className="p-4 border rounded bg-muted text-muted-foreground hover:bg-muted/80"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div
                        className="cursor-pointer flex-1"
                        onClick={() => setSelectedRequest(req)}
                      >
                        <p className="font-medium">
                          {req.action} to {req.environment} - {req.policy}
                        </p>
                        <p className="text-sm">
                          Submitted:{" "}
                          {new Date(req.submittedAt).toLocaleString()}
                        </p>{" "}
                        {/* Added submittedAt display */}
                        <p className="text-sm">
                          JIRA:{" "}
                          {req.jira && (
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
                      <div className="flex items-center space-x-2">
                        <select
                          value={req.status}
                          onChange={(e) =>
                            handleStatusChange(req.id, e.target.value)
                          }
                          className="p-1 rounded bg-background text-foreground border"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleEdit(req)}
                          className="p-1 text-blue-500 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-1 text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`${getStatusBadgeColor(req.status)} text-white`}
                      >
                        {statusOptions.find((opt) => opt.value === req.status)
                          ?.label || "Unknown"}
                      </Badge>
                      {req.history && req.history.length > 1 && (
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1"
                        >
                          <History className="h-3 w-3" />
                          <span>{req.history.length} changes</span>
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {selectedRequest && (
        <div className="mt-4 p-4 border rounded bg-muted text-muted-foreground">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Request Details</h3>
            <Badge
              className={`${getStatusBadgeColor(selectedRequest.status)} text-white`}
            >
              {statusOptions.find((opt) => opt.value === selectedRequest.status)
                ?.label || "Unknown"}
            </Badge>
          </div>
          <p>
            <strong>Submitted:</strong>{" "}
            {new Date(selectedRequest.submittedAt).toLocaleString()}
          </p>{" "}
          {/* Added submittedAt display */}
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
          <p>
            <strong>Action:</strong> {selectedRequest.action}
          </p>
          <p>
            <strong>Environment:</strong> {selectedRequest.environment}
          </p>
          <p>
            <strong>Policy:</strong> {selectedRequest.policy}
          </p>
          <p>
            <strong>Source:</strong> {selectedRequest.source}
          </p>
          <p>
            <strong>Destinations:</strong> {selectedRequest.destinations}
          </p>
          <p>
            <strong>Notes:</strong> {selectedRequest.notes}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(selectedRequest.createdAt).toLocaleString()}
          </p>
          {selectedRequest.history && selectedRequest.history.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Change History</h4>
              <ul className="space-y-2">
                {selectedRequest.history.map((change, index) => (
                  <li key={index} className="text-sm">
                    <p>
                      <strong>
                        {new Date(change.timestamp).toLocaleString()}
                      </strong>{" "}
                      -
                      {change.action === "create"
                        ? " Request created"
                        : " Request edited"}
                    </p>
                    {change.changes &&
                      Object.entries(change.changes).map(([field, value]) => (
                        <p key={field} className="ml-4 text-xs">
                          • Changed {field} to: {value}
                        </p>
                      ))}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}