import open from 'open';
import axios from 'axios';
import { Flow, JSONRPCResponse } from 'flow-launcher-helper';
import { api } from './api.js';

interface GetPackagesResponse {
  data: {
    objects: [
      {
        package: {
          name: string;
          version: string;
          description: string;
          links: {
            npm: string;
          };
        };
      },
    ];
  };
}

type Methods = 'open_result';

const { params, showResult, on, run } = new Flow<Methods>('app.png');

on('query', async () => {
  if (params.length <= 1) {
    return showResult({
      title: 'Waiting for query...',
    });
  }

  try {
    const { data }: GetPackagesResponse = await api.get('/search', {
      params: {
        text: params,
      },
    });

    const results: JSONRPCResponse<Methods>[] = [];

    data.objects.forEach(({ package: result }) => {
      results.push({
        title: `${result.name} | v${result.version}`,
        subtitle: result.description,
        method: 'open_result',
        params: [result.links.npm],
        iconPath: 'app.png',
      });
    });

    showResult(...results);
  } catch (err) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      return showResult({
        title: 'Error',
        subtitle: err.message,
      });
    }
  }
});

on('open_result', () => {
  const url = params;
  open(url);
});

run();
