import { PayLoad } from "@/lib/type";
import { useRouter } from "next/navigation";

export default function CallToAction({ user }:{user:PayLoad}) {
    const router = useRouter();
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden ">
        <div className="absolute -left-40 -top-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute -right-40 -bottom-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
        <div className="absolute inset-0 bg-[url('/public/grid.svg')] bg-[size:40px_40px] opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Rocket animation */}
          <div className="inline-flex items-center justify-center mb-8 animate-bounce-slow">
            <div className="text-5xl">🚀</div>
            <div className="ml-2 w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-blue-800 mb-6">
            Ready to supercharge your AI workflow?
          </h2>
          
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10">
            Try Handy now and keep your best ideas handy. Transform how you create, 
            organize, and access AI prompts forever.
          </p>
          
          {/* Animated button */}
          <div className="relative inline-flex group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-tilt"></div>
            <button onClick={() => router.push(`${user ? "/explore" : "/signIn"}`)} className="relative px-8 py-4 bg-black text-white rounded-xl font-bold text-lg transition-all duration-300 group-hover:scale-105">
              <span className="flex items-center">
                Try Prompt Vault Now
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          </div>
          
         
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-purple-400/10 backdrop-blur-sm border border-purple-500/30 shadow-lg animate-float"></div>
      <div className="absolute top-1/3 right-20 w-6 h-6 rounded-full bg-blue-400/10 backdrop-blur-sm border border-blue-500/30 shadow-lg animate-float animation-delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-10 h-10 rounded-lg rotate-12 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 shadow-lg animate-float animation-delay-2000"></div>
    </section>
  );
}