import './index.css';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { App } from './App';
import { Provider as ReduxProvider } from 'react-redux';


const queryClient = new QueryClient();

createRoot(document.getElementById('root') as HTMLElement).render(
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
  </ReduxProvider>,
);
