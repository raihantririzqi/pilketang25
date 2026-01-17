export type PublishResultsResult = {
  session_id: string;
  is_published: boolean;
  published_at: Date | null;
  total_votes: number;
  total_candidates: number;
};
