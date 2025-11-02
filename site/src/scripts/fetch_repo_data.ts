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

interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  languages: Record<string, number>;
  commitActivity: { week: string; commits: number }[];
}

async function fetchRepoData(): Promise<RepoStats> {
  console.log('Fetching repository data...');

  // Get basic repo info
  const { data: repo } = await octokit.repos.get({
    owner: OWNER,
    repo: REPO,
  });

  // Get languages
  const { data: languages } = await octokit.repos.listLanguages({
    owner: OWNER,
    repo: REPO,
  });

  // Get commit activity (52 weeks)
  const { data: commitActivity } = await octokit.repos.getCommitActivityStats({
    owner: OWNER,
    repo: REPO,
  });

  // Process commit activity for last 12 weeks
  const last12Weeks = (commitActivity || [])
    .slice(-12)
    .map((week) => ({
      week: new Date(week.week * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      commits: week.total,
    }));

  const stats: RepoStats = {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    languages,
    commitActivity: last12Weeks,
  };

  return stats;
}

async function main() {
  try {
    const stats = await fetchRepoData();

    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'public', 'data');
    await mkdir(outputDir, { recursive: true });

    // Write stats to file
    const outputPath = join(outputDir, 'stats.json');
    await writeFile(outputPath, JSON.stringify(stats, null, 2));

    console.log('✓ Repository statistics saved to:', outputPath);
    console.log(`  Stars: ${stats.stars}`);
    console.log(`  Forks: ${stats.forks}`);
    console.log(`  Watchers: ${stats.watchers}`);
    console.log(`  Languages: ${Object.keys(stats.languages).join(', ')}`);
  } catch (error) {
    console.error('Error fetching repository data:', error);
    
    // Create fallback data
    const fallback: RepoStats = {
      stars: 0,
      forks: 0,
      watchers: 0,
      languages: { JavaScript: 50000, Solidity: 30000, CSS: 10000 },
      commitActivity: Array.from({ length: 12 }, (_, i) => ({
        week: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        commits: Math.floor(Math.random() * 10),
      })),
    };

    const outputDir = join(process.cwd(), 'public', 'data');
    await mkdir(outputDir, { recursive: true });
    const outputPath = join(outputDir, 'stats.json');
    await writeFile(outputPath, JSON.stringify(fallback, null, 2));
    
    console.log('✓ Fallback statistics saved');
  }
}

main();
