import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"
import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import Layout from "./routes/Layout.tsx"
import Home from "./routes/Index.tsx"
import Profile from "./routes/profile/Index.tsx"
import Login from "./routes/auth/Login.tsx"
import Register from "./routes/auth/Register.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
          </Route>
          <Route path="/profile" element={<Layout />} >
            <Route path=":id" element={<Profile />} />
          </Route>
          <Route path="/auth" element={<Layout />} >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
