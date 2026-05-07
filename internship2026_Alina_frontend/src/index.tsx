import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { App } from './App';
import {
  Provider as ReduxProvider,
  useDispatch,
  useSelector,
  TypedUseSelectorHook,
} from 'react-redux';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const queryClient = new QueryClient();

createRoot(document.getElementById('root') as HTMLElement).render(
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
  </ReduxProvider>,
);
