#!/usr/bin/env node
import { Octokit } from '@octokit/rest';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = 'cywf';
const REPO = 'willow';

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

interface ProjectItem {
  title: string;
  url: string;
  status: string;
  labels: string[];
  assignees: string[];
  number?: number;
}

async function fetchProjects(): Promise<ProjectItem[]> {
  console.log('Fetching projects...');

  try {
    // Try to use GraphQL API to fetch project v2 items
    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          projectsV2(first: 1) {
            nodes {
              items(first: 100) {
                nodes {
                  content {
                    ... on Issue {
                      title
                      url
                      number
                      labels(first: 10) {
                        nodes {
                          name
                        }
                      }
                      assignees(first: 5) {
                        nodes {
                          login
                        }
                      }
                    }
                    ... on PullRequest {
                      title
                      url
                      number
                      labels(first: 10) {
                        nodes {
                          name
                        }
                      }
                      assignees(first: 5) {
                        nodes {
                          login
                        }
                      }
                    }
                  }
                  fieldValues(first: 10) {
                    nodes {
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        name
                        field {
                          ... on ProjectV2SingleSelectField {
                            name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response: any = await octokit.graphql(query, {
      owner: OWNER,
      repo: REPO,
    });

    const project = response.repository.projectsV2.nodes[0];
    if (!project) {
      throw new Error('No projects found');
    }

    const items: ProjectItem[] = project.items.nodes
      .filter((node: any) => node.content)
      .map((node: any) => {
        const content = node.content;
        const statusField = node.fieldValues.nodes.find(
          (fv: any) => fv.field?.name === 'Status'
        );

        return {
          title: content.title,
          url: content.url,
          status: statusField?.name || 'No Status',
          labels: content.labels?.nodes.map((l: any) => l.name) || [],
          assignees: content.assignees?.nodes.map((a: any) => a.login) || [],
          number: content.number,
        };
      });

    return items;
  } catch (error) {
    console.error('Error fetching projects, falling back to issues:', error);
    return fetchIssuesFallback();
  }
}

async function fetchIssuesFallback(): Promise<ProjectItem[]> {
  console.log('Using issues as fallback...');

  try {
    const { data: issues } = await octokit.issues.listForRepo({
      owner: OWNER,
      repo: REPO,
      state: 'open',
      per_page: 50,
    });

    return issues.map((issue) => ({
      title: issue.title,
      url: issue.html_url,
      status: getStatusFromLabels(issue.labels as any[]),
      labels: (issue.labels as any[]).map((l) => (typeof l === 'string' ? l : l.name)),
      assignees: issue.assignees?.map((a) => a.login) || [],
      number: issue.number,
    }));
  } catch (error) {
    console.error('Error fetching issues:', error);
    return [];
  }
}

function getStatusFromLabels(labels: any[]): string {
  const labelNames = labels.map((l) => (typeof l === 'string' ? l : l.name).toLowerCase());

  if (labelNames.some((l) => l.includes('done') || l.includes('complete'))) {
    return 'Done';
  }
  if (labelNames.some((l) => l.includes('progress') || l.includes('doing'))) {
    return 'In Progress';
  }
  if (labelNames.some((l) => l.includes('todo') || l.includes('backlog'))) {
    return 'To Do';
  }

  return 'To Do'; // Default
}

async function main() {
  try {
    const items = await fetchProjects();

    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'public', 'data');
    await mkdir(outputDir, { recursive: true });

    // Write projects to file
    const outputPath = join(outputDir, 'projects.json');
    await writeFile(outputPath, JSON.stringify(items, null, 2));

    console.log('✓ Projects saved to:', outputPath);
    console.log(`  Total items: ${items.length}`);
  } catch (error) {
    console.error('Error in main:', error);
    
    // Create empty fallback
    const outputDir = join(process.cwd(), 'public', 'data');
    await mkdir(outputDir, { recursive: true });
    const outputPath = join(outputDir, 'projects.json');
    await writeFile(outputPath, JSON.stringify([], null, 2));
    
    console.log('✓ Empty projects file created');
  }
}

main();
