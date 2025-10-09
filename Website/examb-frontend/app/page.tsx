// app/page.tsx
"use client";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Zap,
  Shield,
  Clock,
  Star,
  Sparkles,
  Target,
  Rocket,
  BarChart3,
  Globe,
  Heart,
  DollarSign,
  Quote,
  ArrowRight,
  Play,
  GraduationCap,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // Expanded dummy data for testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School Teacher",
      quote: "ExamB has transformed how I manage exams. The analytics are a game-changer! My students love the interactive feedback.",
      rating: 5,
      image: "https://prophotos.ai/wp-content/uploads/2024/02/14064470-2.jpg",
    },
    {
      name: "Michael Chen",
      role: "University Student",
      quote: "I love how easy it is to track my progress and prepare for exams with ExamB. It's like having a personal tutor!",
      rating: 4.8,
      image: "https://cdn.prod.website-files.com/66f962143835f103fe66ea43/67fad18efb163757cb64a5ea_Professional%20Headshot%20Examples%20Female%2054.jpg",
    },
    {
      name: "Emily Davis",
      role: "School Administrator",
      quote: "The platform is secure, intuitive, and saves us hours every week. Integration with our LMS was seamless.",
      rating: 4.9,
      image: "https://cdn.prod.website-files.com/67017735bb003974499feb31/67ad892c1edce5b0e885d628_keegan%201.jpg",
    },
    {
      name: "David Rodriguez",
      role: "College Professor",
      quote: "Creating custom exams has never been easier. The AI grading feature is spot-on and saves me so much time.",
      rating: 5,
      image: "https://prophotos.ai/wp-content/uploads/2024/02/Real_Img2.png",
    },
    {
      name: "Lisa Thompson",
      role: "Tutor",
      quote: "ExamB's progress tracking helped my students improve by 30% in just one semester. Highly recommend!",
      rating: 4.9,
      image: "https://cdn.prod.website-files.com/66f962143835f103fe66ea43/6759641ccf703a5a7e41673d_Woman%20-%20garden%20beige%20blazer%207-1.jpg",
    },
    {
      name: "James Patel",
      role: "High School Student",
      quote: "The mobile app makes studying on the go a breeze. Gamified quizzes keep me motivated!",
      rating: 4.7,
      image: "https://cdn.prod.website-files.com/66f962143835f103fe66ea43/679dc6d988bb741fd81d230f_keisha%206.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-5 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-5 w-[32rem] h-[32rem] bg-cyan-400/20 rounded-full blur-3xl animate-pulse-glow delay-700"></div>
        <div className="absolute top-1/3 left-2/3 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-float delay-300"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-purple-100/50 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-600 bg-clip-text text-transparent">
              ExamB
            </span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2.5 text-gray-700 font-semibold hover:text-purple-600 transition-all hover:scale-105"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-600 text-white font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Sign up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-slideInLeft relative z-10">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 rounded-full text-base font-bold shadow-lg animate-bounce-subtle">
                <Sparkles className="w-5 h-5" />
                Next-Gen Exam Management
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-tight text-balance">
                Revolutionize your{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                  exam journey
                </span>
              </h1>
              <p className="text-2xl text-gray-700 leading-relaxed text-pretty font-medium">
                Empowering students and educators with an intuitive platform to create, manage, and excel in exams. Join 25,000+ users worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  onClick={() => router.push("/signup")}
                  className="group px-10 py-6 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Get Started Free
                    <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <button
                  onClick={() => router.push("/demo")}
                  className="px-10 py-6 bg-white text-gray-800 font-bold rounded-2xl border-2 border-purple-200 hover:border-purple-500 hover:text-purple-600 hover:shadow-xl transition-all hover:scale-105"
                >
                  View Demo
                </button>
              </div>
              <div className="flex flex-wrap gap-8 pt-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-semibold">25,000+ Users</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-cyan-600" />
                  </div>
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="font-semibold">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-semibold">50+ Countries</span>
                </div>
              </div>
            </div>
            {/* Hero Visual - Using image from internet */}
            <div className="relative animate-slideInRight">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur-3xl opacity-30 animate-pulse-glow"></div>
              <img
                src="https://multipurposethemes.com/wp-content/uploads/2025/04/Education-LMS-Dashboard-Admin-Template-2-1200x675.jpg"
                alt="ExamB Dashboard Preview"
                className="relative w-full h-auto rounded-3xl shadow-2xl border border-purple-100/50 animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Expanded to 9 features */}
      <section className="py-28 px-6 bg-white/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fadeIn">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-purple-100 text-purple-700 rounded-full text-base font-bold mb-6 shadow-lg">
              <Target className="w-5 h-5" />
              Core Features
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-balance">
              Tools to{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600 bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="text-xl text-gray-700 text-pretty font-medium max-w-3xl mx-auto">
              Discover powerful features crafted to streamline exam management and boost performance for over 100,000 exams created.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Blazing Speed",
                description: "Create and grade exams instantly with cutting-edge AI technology and auto-grading.",
                color: "from-purple-600 via-purple-500 to-purple-400",
                bgColor: "from-purple-50 to-purple-100",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
                delay: "delay-100",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description: "Seamlessly work with students, teachers, and admins in real-time with shared workspaces.",
                color: "from-cyan-600 via-cyan-500 to-cyan-400",
                bgColor: "from-cyan-50 to-cyan-100",
                iconBg: "bg-cyan-100",
                iconColor: "text-cyan-600",
                delay: "delay-200",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Deep Analytics",
                description: "Gain insights with detailed reports, performance tracking, and predictive trends.",
                color: "from-pink-600 via-pink-500 to-pink-400",
                bgColor: "from-pink-50 to-pink-100",
                iconBg: "bg-pink-100",
                iconColor: "text-pink-600",
                delay: "delay-300",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Top Security",
                description: "Bank-grade encryption and compliance with GDPR, ensuring your data is always safe.",
                color: "from-indigo-600 via-indigo-500 to-indigo-400",
                bgColor: "from-indigo-50 to-indigo-100",
                iconBg: "bg-indigo-100",
                iconColor: "text-indigo-600",
                delay: "delay-400",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Access",
                description: "Access exams from any device, anywhere, with offline mode and multi-language support.",
                color: "from-teal-600 via-teal-500 to-teal-400",
                bgColor: "from-teal-50 to-teal-100",
                iconBg: "bg-teal-100",
                iconColor: "text-teal-600",
                delay: "delay-500",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Intuitive Design",
                description: "A user-friendly interface with customizable themes for the best experience.",
                color: "from-rose-600 via-rose-500 to-rose-400",
                bgColor: "from-rose-50 to-rose-100",
                iconBg: "bg-rose-100",
                iconColor: "text-rose-600",
                delay: "delay-600",
              },
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: "AI-Powered Insights",
                description: "Get personalized study recommendations and adaptive learning paths.",
                color: "from-emerald-600 via-emerald-500 to-emerald-400",
                bgColor: "from-emerald-50 to-emerald-100",
                iconBg: "bg-emerald-100",
                iconColor: "text-emerald-600",
                delay: "delay-700",
              },
              {
                icon: <Play className="w-8 h-8" />,
                title: "Interactive Quizzes",
                description: "Engage students with multimedia quizzes, videos, and gamified challenges.",
                color: "from-orange-600 via-orange-500 to-orange-400",
                bgColor: "from-orange-50 to-orange-100",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                delay: "delay-800",
              },
              {
                icon: <ArrowRight className="w-8 h-8" />,
                title: "Seamless Integration",
                description: "Connect with Google Classroom, Moodle, and more for effortless workflow.",
                color: "from-amber-600 via-amber-500 to-amber-400",
                bgColor: "from-amber-50 to-amber-100",
                iconBg: "bg-amber-100",
                iconColor: "text-amber-600",
                delay: "delay-900",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group p-8 bg-gradient-to-br ${feature.bgColor} rounded-3xl border-2 border-white shadow-lg hover:shadow-2xl transition-all animate-fadeInScale ${feature.delay} hover:scale-105 cursor-pointer`}
              >
                <div
                  className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center ${feature.iconColor} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-md`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - New Section */}
      <section className="py-28 px-6 bg-gradient-to-br from-cyan-50 to-purple-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fadeIn">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/50 text-purple-700 rounded-full text-base font-bold mb-6 shadow-lg">
              <ArrowRight className="w-5 h-5" />
              How It Works
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-balance">
              Simple{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600 bg-clip-text text-transparent">
                3-Step
              </span>{" "}
              Process
            </h2>
            <p className="text-xl text-gray-700 text-pretty font-medium max-w-3xl mx-auto">
              Get up and running in minutes with our streamlined workflow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {[
              {
                icon: <BookOpen className="w-16 h-16 text-purple-600 bg-purple-100 rounded-2xl p-4" />,
                title: "Create",
                description: "Build exams with our intuitive editor and AI assistance.",
                number: "01",
              },
              {
                icon: <Zap className="w-16 h-16 text-cyan-600 bg-cyan-100 rounded-2xl p-4" />,
                title: "Assess",
                description: "Distribute and auto-grade with instant feedback.",
                number: "02",
              },
              {
                icon: <BarChart3 className="w-16 h-16 text-pink-600 bg-pink-100 rounded-2xl p-4" />,
                title: "Analyze",
                description: "Track progress and generate insightful reports.",
                number: "03",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-all">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:shadow-2xl transition-all">
                  {step.number}
                </div>
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-2xl font-black mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed font-medium">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Expanded to 6 */}
      <section className="py-28 px-6 bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-100 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fadeIn">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/50 text-purple-700 rounded-full text-base font-bold mb-6 shadow-lg">
              <Quote className="w-5 h-5" />
              What Our Users Say
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-balance">
              Loved by{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600 bg-clip-text text-transparent">
                thousands
              </span>
            </h2>
            <p className="text-xl text-gray-700 text-pretty font-medium max-w-3xl mx-auto">
              Hear from educators and students who trust ExamB for their success across 50+ countries.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 animate-fadeInScale delay-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(testimonial.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed font-medium italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Updated with more stats */}
      <section className="py-28 px-6 bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-600 text-white relative overflow-hidden animate-gradient">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-slideInLeft">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-sm rounded-full text-base font-bold">
                <TrendingUp className="w-5 h-5" />
                Why ExamB
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-balance">Why educators and students choose ExamB</h2>
              <p className="text-xl text-purple-100 leading-relaxed text-pretty font-medium">
                Join over 25,000 users who have transformed their exam workflows with ExamB's innovative tools.
              </p>
              <div className="space-y-6">
                {[
                  { text: "Create exams in minutes with AI assistance and 100+ templates", icon: <Clock className="w-6 h-6" /> },
                  { text: "Instant grading with detailed feedback for 50,000+ exams monthly", icon: <Zap className="w-6 h-6" /> },
                  { text: "Comprehensive analytics for performance tracking across classes", icon: <BarChart3 className="w-6 h-6" /> },
                  { text: "Enterprise-grade security and 24/7 support for peace of mind", icon: <Shield className="w-6 h-6" /> },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all group"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                      {benefit.icon}
                    </div>
                    <span className="text-lg font-semibold">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-slideInRight">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 shadow-2xl">
                <div className="space-y-8">
                  {[
                    { emoji: "🎯", number: "25,000+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
                    { emoji: "⚡", number: "100,000+", label: "Exams Created", icon: <Award className="w-6 h-6" /> },
                    { emoji: "⭐", number: "4.9/5", label: "User Rating", icon: <Star className="w-6 h-6" /> },
                    { emoji: "🌍", number: "50+", label: "Countries", icon: <Globe className="w-6 h-6" /> },
                    { emoji: "📊", number: "1M+", label: "Grades Issued", icon: <BarChart3 className="w-6 h-6" /> },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-5 p-5 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all group hover:scale-105"
                    >
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                        {stat.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="text-3xl font-black">{stat.number}</div>
                        <div className="text-purple-100 font-semibold flex items-center gap-2">
                          {stat.icon}
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced with image */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-100 opacity-50"></div>
        {/* CTA Image from internet */}
        <div className="max-w-6xl mx-auto mb-12 animate-fadeIn">
          <img
            src="https://multipurposethemes.com/wp-content/uploads/2023/10/horizontal-ltr-dark-dashboard-1.jpg"
            alt="ExamB CTA - Modern Dashboard"
            className="w-full h-auto rounded-3xl shadow-2xl border border-white/20"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-10 animate-fadeIn relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-purple-100 text-purple-700 rounded-full text-base font-bold shadow-lg">
            <Sparkles className="w-5 h-5" />
            Start Your Journey
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-balance">Ready to transform your exams?</h2>
          <p className="text-xl text-gray-700 text-pretty font-medium">
            Join ExamB today and experience the future of exam management with tools trusted by top educators.
          </p>
          <button
            onClick={() => router.push("/signup")}
            className="group px-12 py-6 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all relative overflow-hidden inline-flex items-center gap-3"
          >
            <span className="relative z-10">Start Free Trial</span>
            <Rocket className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">ExamB</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="/features" className="text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
              Blog
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>
          <p className="text-sm font-medium">© 2025 ExamB. All rights reserved.</p>
          <p className="text-xs mt-2 text-gray-500">Made with ❤️ for educators and students worldwide</p>
        </div>
      </footer>
    </div>
  );
}