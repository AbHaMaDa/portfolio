import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '../api/portfolio';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioApi.getPortfolio,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => portfolioApi.getProjectBySlug(slug),
    enabled: Boolean(slug),
  });
}
