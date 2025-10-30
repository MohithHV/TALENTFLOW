import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { worker } from './mocks/browser'
import { initializeMockData } from './mocks/init'
import { ThemeProvider } from './components/shared/ThemeProvider'

async function prepare() {
  // Initialize the database with seed data
  await initializeMockData();

  // Start MSW worker
  await worker.start({
    onUnhandledRequest: 'bypass',
  });

  console.log('Mock Service Worker started');
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </StrictMode>,
  );
});
