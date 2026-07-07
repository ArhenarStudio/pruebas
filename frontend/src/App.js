import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "@/context/ConfigContext";
import { Toaster } from "@/components/ui/sonner";
import Builder from "@/pages/Builder";
import StorePage from "@/pages/StorePage";

function App() {
  return (
    <div className="App">
      <ConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Builder />} />
            <Route path="/store" element={<StorePage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </ConfigProvider>
    </div>
  );
}

export default App;
