import { Octokit } from '@octokit/rest';

class OctokitService {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      userAgent: 'ai-foundry-monorepo/1.0.0'
    });
  }

  async getCurrentUser() {
    try {
      const { data } = await this.octokit.rest.users.getAuthenticated();
      return {
        login: data.login,
        name: data.name,
        email: data.email,
        avatar_url: data.avatar_url,
        public_repos: data.public_repos,
        followers: data.followers,
        following: data.following
      };
    } catch (error) {
      console.error('Error fetching GitHub user:', error.message);
      throw new Error('Failed to fetch user information');
    }
  }

  async getUserRepositories(options = {}) {
    try {
      const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        direction: 'desc',
        per_page: options.limit || 30,
        page: options.page || 1
      });

      return data.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        created_at: repo.created_at
      }));
    } catch (error) {
      console.error('Error fetching repositories:', error.message);
      throw new Error('Failed to fetch repositories');
    }
  }

  async createIssue(owner, repo, title, body, labels = []) {
    try {
      const { data } = await this.octokit.rest.issues.create({
        owner,
        repo,
        title,
        body,
        labels
      });
      return data;
    } catch (error) {
      console.error('Error creating issue:', error.message);
      throw new Error('Failed to create issue');
    }
  }

  async getRepository(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo
      });
      return data;
    } catch (error) {
      console.error('Error fetching repository:', error.message);
      throw new Error('Failed to fetch repository');
    }
  }

  isConfigured() {
    return !!process.env.GITHUB_TOKEN;
  }
}

export const octokitService = new OctokitService();