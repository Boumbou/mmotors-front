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
import Vehicles from "./routes/vehicles/Index.tsx"
import About from "./routes/about/Index.tsx"
import AuthLayout from "./routes/auth/Layout.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          //home and about routes
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
          </Route>
          <Route path="/about" element={<Layout />} >
            <Route index element={<About />} />
          </Route>

          //authentication routes
          <Route path="/auth" element={<AuthLayout />} >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          //catalogue route
          <Route path="/catalogue" element={<Layout />} >
            <Route index element={<Vehicles />} />
            {/* <Route  path="locations" element={<Vehicles />} /> */}
          </Route>

          //protected route, only accessible if user is logged in
          <Route path="/profile" element={<Layout />} >
            <Route index element={<Profile />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
