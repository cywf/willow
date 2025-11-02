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

interface Discussion {
  title: string;
  url: string;
  author: string;
  createdAt: string;
  category: string;
  comments: number;
  answerChosen?: boolean;
}

async function fetchDiscussions(): Promise<Discussion[]> {
  console.log('Fetching discussions...');

  try {
    // Use GraphQL API to fetch discussions
    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          discussions(first: 25, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              title
              url
              author {
                login
              }
              createdAt
              category {
                name
              }
              comments {
                totalCount
              }
              answer {
                id
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

    const discussions: Discussion[] = response.repository.discussions.nodes.map((node: any) => ({
      title: node.title,
      url: node.url,
      author: node.author?.login || 'Unknown',
      createdAt: node.createdAt,
      category: node.category.name,
      comments: node.comments.totalCount,
      answerChosen: !!node.answer,
    }));

    return discussions;
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return [];
  }
}

async function main() {
  try {
    const discussions = await fetchDiscussions();

    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'public', 'data');
    await mkdir(outputDir, { recursive: true });

    // Write discussions to file
    const outputPath = join(outputDir, 'discussions.json');
    await writeFile(outputPath, JSON.stringify(discussions, null, 2));

    console.log('✓ Discussions saved to:', outputPath);
    console.log(`  Total discussions: ${discussions.length}`);
  } catch (error) {
    console.error('Error in main:', error);
    
    // Create empty fallback
    const outputDir = join(process.cwd(), 'public', 'data');
    await mkdir(outputDir, { recursive: true });
    const outputPath = join(outputDir, 'discussions.json');
    await writeFile(outputPath, JSON.stringify([], null, 2));
    
    console.log('✓ Empty discussions file created');
  }
}

main();
