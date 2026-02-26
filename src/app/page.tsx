import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative scanline">
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Stack />
      <Newsletter />
      <Footer />
    </main>
  );
}
