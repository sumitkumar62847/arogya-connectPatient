import { Blocks, FileCheck2, Goal, Lock, HeartPulse, UserPlus, FileX, MessagesSquare, Banknote, Smartphone, ShieldCheck, Languages, Plus, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './allCss.css'

import "tailwindcss/tailwind.css";
import {Header} from "../components/Header";





export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      bg: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
      title: "Your Health Story, All in One Place.",
      desc: "A single, secure health record for migrant workers in Kerala. Accessible anytime, anywhere, in your language.",
    },
    {
      bg: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?q=80&w=1935&auto=format&fit=crop",
      title: "Proactive Care for a Healthier Community.",
      desc: "Our smart system helps public health officials predict and prevent disease outbreaks, keeping everyone safe.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  return (
    <div className="bg-gray-100 w-full text-gray-800 font-[Poppins]">
      <Header />

      <section id="home" className="relative h-[60vh] text-white overflow-hidden">
        <div className="absolute inset-0">
          {carouselSlides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                currentSlide === i ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-3xl px-4 relative">
            <h2 className="text-4xl md:text-5xl font-extrabold">
              {carouselSlides[currentSlide].title}
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              {carouselSlides[currentSlide].desc}
            </p>
          </div>
        </div>
      </section>

      <section id="get-started" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
            Get Started with Arogya Connect
          </h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-10 rounded"></div>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Create your unique digital health ID to access your records or log in
            if you already have one.
          </p>
          <div className="max-w-4xl mx-auto grid grid-cols-1">
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center hover:shadow-xl">
              <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Enter your credentials</h4>
              <p className="text-gray-600 mb-6">
                Create your Arogya Connect ID with your mobile number to start/Login.
              </p>
              <Link
                to="/login"
                className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register / login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
            We Understand Your Challenges
          </h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-10 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <FileX className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold">Lost Records</h4>
              <p className="mt-2 text-gray-600">
                Paper prescriptions and reports get lost when you move, making it
                hard for new doctors to understand your health.
              </p>
            </div>
            <div className="text-center p-6">
              <MessagesSquare className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold">Language Barriers</h4>
              <p className="mt-2 text-gray-600">
                Explaining your medical history in a new place can be difficult,
                leading to confusion and improper care.
              </p>
            </div>
            <div className="text-center p-6">
              <Banknote className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold">Repeated Costs</h4>
              <p className="mt-2 text-gray-600">
                Without your history, doctors may need to repeat expensive tests,
                costing you time and money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
            Arogya Connect is Your Solution
          </h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-10 rounded"></div>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            We provide a free, simple, and secure digital platform to manage your
            health information, no matter where you are.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold">One Digital ID</h4>
              <p className="mt-2 text-gray-600">
                Register once with your mobile number to get a unique Health ID
                that stores all your records safely.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl">
              <ShieldCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold">Always Accessible</h4>
              <p className="mt-2 text-gray-600">
                Doctors can instantly access your history with your consent,
                ensuring you get the right treatment every time.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl">
              <Languages className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold">In Your Language</h4>
              <p className="mt-2 text-gray-600">
                View your prescriptions and health alerts in your own language,
                with voice assistance to help you understand.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="security" className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-4">Our Commitment to Security & Compliance</h3>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-10 rounded"></div>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">We prioritize data security to build trust with both our healthcare partners and the communities we serve.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <SecurityPillar icon={<Lock />} title="End-to-End Encryption" description="All data is protected with industry-standard encryption protocols." />
              <SecurityPillar icon={<FileCheck2 />} title="DPDP Act Aligned" description="Built on a foundation of explicit, informed, and revocable consent." />
              <SecurityPillar icon={<Blocks />} title="Interoperable by Design" description="Using the HL7 FHIR standard ensures your data is structured and secure." />
              <SecurityPillar icon={<Goal />} title="SDG Focused" description="Our solution directly supports SDGs 3, 10, & 16 for a sustainable future." />
            </div>
          </div>
        </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
            Voices from the Community
          </h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-10 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:shadow-xl">
              <p className="text-gray-600 italic">
                "For the first time, I don't have to carry a plastic bag of old papers. The doctor saw my whole history on the computer in seconds. It made me feel safe."
              </p>
              <div className="mt-4 text-right">
                <p className="font-bold">- Ram Kumar S.</p>
                <p className="text-sm text-gray-500">Construction Worker, Ernakulam</p>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:shadow-xl">
              <p className="text-gray-600 italic">
                "Arogya Connect is a game-changer. I can see a patient's allergies and past treatments instantly. It reduces risk and helps me provide better, faster care."
              </p>
              <div className="mt-4 text-right">
                <p className="font-bold">- Dr. Priya Nair</p>
                <p className="text-sm text-gray-500">Physician, Kochi Health Camp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
            About Arogya Connect
          </h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-10 rounded"></div>
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1551884831-bbf3cdc64343?q=80&w=1938&auto=format&fit=crop"
                alt="Doctor and patient"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h4 className="text-2xl font-bold mb-4 text-gray-700">
                Our Mission: Health Equity for All
              </h4>
              <p className="text-gray-600 mb-4">
                Arogya Connect is a public health initiative designed to address
                the critical gap in healthcare for India's interstate migrant
                workers. We understand that a mobile workforce faces unique
                challenges, from lost records to language barriers.
              </p>
              <p className="text-gray-600">
                Our mission is to leverage technology to build an inclusive,
                equitable, and proactive healthcare system that leaves no one
                behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-10 rounded"></div>
          <div className="space-y-4">
            {[
              {
                q: "Is this service free for migrant workers?",
                a: "Yes, registration and access to your health records through Arogya Connect is completely free for all migrant workers in Kerala.",
              },
              {
                q: "Is my health data safe?",
                a: "Absolutely. Your data is encrypted and stored securely. We follow strict privacy standards, and only authorized medical professionals can access your records with your consent.",
              },
              {
                q: "What if I lose my phone or forget my ID?",
                a: "Your health record is safe. You can visit any participating health camp and verify your identity with your registered mobile number and Aadhaar to regain access to your account.",
              },
            ].map((item, i) => (
              <details key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <summary className="flex justify-between items-center font-semibold cursor-pointer">
                  {item.q}
                  <Plus className="h-5 w-5 text-blue-600" />
                </summary>
                <div className="mt-4 text-gray-600 text-sm">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <HeartPulse className="h-8 w-8 text-blue-500" />
                <h4 className="font-bold text-lg">Arogya Connect</h4>
              </div>
              <p className="text-gray-400 text-sm">
                A digital health initiative for the migrant workers of Kerala.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#solution" className="text-gray-400 hover:text-white">Our Solution</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <p className="text-gray-400 text-sm">Health Directorate, Kerala</p>
              <p className="text-gray-400 text-sm mt-2">Email: contact@arogyaconnect.in</p>
              <p className="text-gray-400 text-sm">Helpline: 1800-123-4567</p>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-8">
            © 2025 Arogya Connect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const SecurityPillar = ({ icon, title, description }) => (
  <div className="text-center p-6">
    {React.cloneElement(icon, { className: "h-12 w-12 text-blue-600 mx-auto mb-4" })}
    <h4 className="text-xl font-semibold">{title}</h4>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

