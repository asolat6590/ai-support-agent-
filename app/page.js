import Advantages from "@/components/Advantages";
import ChatWidget from "@/components/ChatWidget";
import Contacts from "@/components/Contacts";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import { clinic } from "@/lib/knowledge";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Advantages />
        <Faq items={clinic.faq} />
        <Contacts />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
