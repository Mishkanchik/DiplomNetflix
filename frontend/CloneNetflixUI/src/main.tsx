import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import {AppWrapper} from "./common/PageMeta.tsx";
import { LanguageProvider } from "./contexts/LanguageContext.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <LanguageProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </LanguageProvider>
  </BrowserRouter>,
)
