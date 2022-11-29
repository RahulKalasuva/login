import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";

import { PageLayout } from "./components/PageLayout";
import { Home } from "./pages/Home";
import { TodoList } from "./pages/TodoList";

import "./styles/App.css";

const Pages = () => {
    return (
        <Routes>
            <Route path="/todolist" element={<TodoList />} />
            <Route path="/" element={<Home />} />
        </Routes>
    )
}

const App = ({ instance }) => {
    return (
        <Router>
            <MsalProvider instance={instance}>
                <PageLayout>
                    <Pages />
                </PageLayout>
            </MsalProvider>
        </Router>
    );
}

export default App;
