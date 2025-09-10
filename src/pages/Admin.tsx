import { AutomationStatus } from "@/components/AutomationStatus";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Admin = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Cyprus Pets</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <AutomationStatus />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Admin;