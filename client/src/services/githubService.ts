
/*
 * GitHub API integration service
 /

interface GitHubConfig {
  owner: string;
  repo: string;
  path: string;
  token: string;
}

// Default to environment variables if available
const defaultConfig: GitHubConfig = {
  owner: import.meta.env.VITE_GITHUB_OWNER || '',
  repo: import.meta.env.VITE_GITHUB_REPO || '',
  path: import.meta.env.VITE_GITHUB_PATH || 'proxy-requests.md',
  token: import.meta.env.VITE_GITHUB_TOKEN || ''
};

export async function pushToGitHub(
  markdownContent: string, 
  config: Partial<GitHubConfig> = {}
): Promise<boolean> {
  // Merge default config with provided config
  const { owner, repo, path, token } = { ...defaultConfig, ...config };
  
  if (!owner || !repo || !path || !token) {
    console.error('GitHub configuration is incomplete');
    return false;
  }

  try {
    // First, check if file exists and get its SHA if it does
    const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const fileResponse = await fetch(fileUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let sha: string | undefined;
    if (fileResponse.ok) {
      const fileData = await fileResponse.json();
      sha = fileData.sha;

      // If file exists, we need to get current content and append to it
      const currentContent = atob(fileData.content);
      markdownContent = currentContent + '\n\n' + markdownContent;
    }

    // Create or update file
    const response = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update proxy requests',
        content: btoa(markdownContent),
        sha // Include only if updating existing file
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to push to GitHub:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error pushing to GitHub:', error);
    return false;
  }
}

/**
 * Format a single proxy request to markdown
 
export function formatRequestAsMarkdown(request: any): string {
  const timestamp = new Date().toISOString();
  
  return `## ${request.action} - ${request.policy}
- **Status**: ${request.status}
- **Submitted**: ${new Date(request.submittedAt).toLocaleString()}
- **Environment**: ${request.environment}
- **JIRA**: ${request.jira || 'N/A'}
- **Source**: ${request.source || 'N/A'}
- **Destinations**: ${request.destinations}
- **Notes**: ${request.notes || 'N/A'}
- **ID**: \`${request.id}\`

---`;
}

