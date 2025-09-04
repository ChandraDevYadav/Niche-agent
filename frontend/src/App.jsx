import React from "react";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import ConsultingNicheForm from "./components/ConsultingNicheForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Dashboard />
      {/* <ConsultingNicheForm /> */}
    </div>
  );
}

export default App;
