import type { APIRoute } from 'astro';
import newsData from '../../../lbw-data/news.json';

export const GET: APIRoute = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const PAGE_SIZE = 10;
  
  const sortedNews = [...newsData].sort((a, b) => 
    new Date(b.happened).getTime() - new Date(a.happened).getTime()
  );
  
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  
  return new Response(
    JSON.stringify({
      news: sortedNews.slice(start, end),
      total: Math.ceil(sortedNews.length / PAGE_SIZE),
      page
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};