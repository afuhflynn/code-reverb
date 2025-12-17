import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import Reveal from "@/components/navbar/reveal";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen">
      {/* <Navbar /> */}
      <Reveal />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
