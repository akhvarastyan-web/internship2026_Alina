import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { App } from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root') as HTMLElement).render(
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ReduxProvider>,
);
