import React, { useEffect } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1D1D1B] font-serif selection:bg-km-red/10 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-[#F0F0EE] z-50 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#CBCBC9] hover:text-km-red transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span className="font-display text-xl uppercase tracking-widest">Keep Meaning</span>
        <div className="w-16"></div> {/* Spacer for balance */}
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="mb-16 space-y-4">
          <div className="w-12 h-12 bg-km-red/5 rounded-2xl flex items-center justify-center mb-6 border border-km-red/10">
            <Shield className="text-km-red w-6 h-6" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter leading-none">Privacy Policy</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E8E]">Last updated March 14, 2026</p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed text-black/80">
          <section className="space-y-4">
            <p>
              This Privacy Notice for Keepmeaning ('we', 'us', or 'our'), describes how and why we might access, collect, store, use, and/or share ('process') your personal information when you use our services ('Services'), including when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 opacity-80">
              <li>Visit our website at https://www.keepmeaning.xyz or any website of ours that links to this Privacy Notice</li>
              <li>Use KeepMeaning. KeepMeaning is an AI-powered writing engine designed to help users refine their writing style and generate content drafts. The service analyzes user-provided text to create a unique 'Voice DNA' profile, utilizes artificial intelligence to generate and audit text, and stores user history to provide a personalized experience. It is intended for use by founders, specialists, and builders to create authentic, professional content.</li>
              <li>Engage with us in other related ways, including any marketing or events</li>
            </ul>
            <p>
              Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-km-red border-b border-[#F0F0EE] pb-4">1. What Information Do We Collect?</h2>
            <div className="space-y-4">
              <h3 className="font-bold italic">Personal information you disclose to us</h3>
              <p className="opacity-80"><strong>In Short:</strong> We collect personal information that you provide to us.</p>
              <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
              <p><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
              <ul className="list-disc pl-6 space-y-2 opacity-80">
                <li>Email addresses</li>
                <li>Names</li>
              </ul>
              <p><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
              <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
            </div>
            
            <div className="space-y-4 pt-4">
              <h3 className="font-bold italic">Information automatically collected</h3>
              <p className="opacity-80"><strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</p>
              <p>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
              <p>Like many businesses, we also collect information through cookies and similar technologies.</p>
              <p>The information we collect includes:</p>
              <ul className="list-disc pl-6 space-y-2 opacity-80">
                <li><strong>Log and Usage Data:</strong> Service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services.</li>
                <li><strong>Device Data:</strong> Information about your computer, phone, tablet, or other device you use to access the Services.</li>
                <li><strong>Location Data:</strong> Information about your device's location, which can be either precise or imprecise.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-km-red border-b border-[#F0F0EE] pb-4">2. How Do We Process Your Information?</h2>
            <p className="opacity-80"><strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</p>
            <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
            <ul className="list-disc pl-6 space-y-2 opacity-80">
              <li>To facilitate account creation and authentication and otherwise manage user accounts.</li>
              <li>To save or protect an individual's vital interest, such as to prevent harm.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-km-red border-b border-[#F0F0EE] pb-4">3. Do We Offer Artificial Intelligence-Based Products?</h2>
            <p className="opacity-80"><strong>In Short:</strong> We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.</p>
            <p>As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, 'AI Products'). These tools are designed to enhance your experience and provide you with innovative solutions. The terms in this Privacy Notice govern your use of the AI Products within our Services.</p>
            <h3 className="font-bold italic">Use of AI Technologies</h3>
            <p>We provide the AI Products through third-party service providers ('AI Service Providers'), including Mistral AI. As outlined in this Privacy Notice, your input, output, and personal information will be shared with and processed by these AI Service Providers to enable your use of our AI Products. You must not use the AI Products in any way that violates the terms or policies of any AI Service Provider.</p>
            <h3 className="font-bold italic">How We Process Your Data Using AI</h3>
            <p>All personal information processed using our AI Products is handled in line with our Privacy Notice and our agreement with third parties. This ensures high security and safeguards your personal information throughout the process, giving you peace of mind about your data's safety.</p>
          </section>

          <section className="space-y-6">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-km-red border-b border-[#F0F0EE] pb-4">4. How Do We Keep Your Information Safe?</h2>
            <p className="opacity-80"><strong>In Short:</strong> We aim to protect your personal information through a system of organisational and technical security measures.</p>
            <p>We have implemented appropriate and reasonable technical and organisational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.</p>
          </section>

          <section className="space-y-6">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-km-red border-b border-[#F0F0EE] pb-4">5. Do We Collect Information From Minors?</h2>
            <p className="opacity-80"><strong>In Short:</strong> We do not knowingly collect data from or market to children under 18 years of age.</p>
            <p>We do not knowingly collect, solicit data from, or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction. By using the Services, you represent that you are at least 18. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records.</p>
          </section>

          <section className="space-y-6">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-km-red border-b border-[#F0F0EE] pb-4">6. How Can You Contact Us About This Notice?</h2>
            <p>If you have questions or comments about this notice, you may contact us by email at:</p>
            <p className="font-bold">info@keepmeaning.xyz</p>
            <p className="pt-4">Or by post at:</p>
            <address className="not-italic opacity-80">
              Keep Meaning<br />
              Bengaluru 560075<br />
              India
            </address>
          </section>

        </div>
      </main>
    </div>
  );
}
