"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/auth-slice";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  Users,
  Briefcase,
  CheckCircle,
  Star,
  Building,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  MessageSquare,
  Search,
  FileText,
  BarChart3,
  Laptop,
  Megaphone,
  Palette,
  Handshake,
  Calculator,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function HomePage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (session) {
      dispatch(setUser(session.user));
    }
  }, [session, dispatch]);

  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "Smart Job Search",
      description:
        "Find jobs that match your skills and preferences with our intelligent search algorithm.",
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Easy Applications",
      description:
        "Apply to multiple jobs with a single profile and track your application status.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "Direct Messaging",
      description:
        "Communicate directly with recruiters and employers through our platform.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Analytics Dashboard",
      description:
        "Track your job search progress with detailed analytics and insights.",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure Platform",
      description:
        "Your data is protected with enterprise-grade security measures.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Career Growth",
      description:
        "Access resources and tools to help you advance your career.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      content:
        "This platform helped me land my dream job in just 3 weeks. The application process was seamless!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "HR Manager",
      company: "Innovate Inc",
      content:
        "We've found amazing candidates through this platform. The quality of applicants is outstanding.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Specialist",
      company: "Creative Solutions",
      content:
        "The direct messaging feature made it so easy to connect with potential employers. Highly recommend!",
      rating: 4,
      avatar: "ER",
    },
  ];

  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      value: "50K+",
      label: "Active Job Seekers",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      value: "10K+",
      label: "Job Listings",
    },
    {
      icon: <Building className="h-6 w-6" />,
      value: "5K+",
      label: "Companies",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      value: "25K+",
      label: "Successful Placements",
    },
  ];

  const jobCategories = [
    {
      name: "Technology",
      icon: <Laptop className="h-8 w-8" />,
      jobs: 1240,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Marketing",
      icon: <Megaphone className="h-8 w-8" />,
      jobs: 890,
      color: "bg-teal-100 text-teal-600",
    },
    {
      name: "Design",
      icon: <Palette className="h-8 w-8" />,
      jobs: 650,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "Sales",
      icon: <Handshake className="h-8 w-8" />,
      jobs: 1120,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      name: "Finance",
      icon: <Calculator className="h-8 w-8" />,
      jobs: 780,
      color: "bg-sky-100 text-sky-600",
    },
    {
      name: "Healthcare",
      icon: <Heart className="h-8 w-8" />,
      jobs: 920,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  const featuredJobs = [
    {
      title: "Senior Frontend Developer",
      company: "Tech Innovations",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      tags: ["React", "TypeScript", "Next.js"],
    },
    {
      title: "UX/UI Designer",
      company: "Creative Studio",
      location: "Remote",
      type: "Contract",
      salary: "$90k - $110k",
      posted: "1 week ago",
      tags: ["Figma", "UI Design", "User Research"],
    },
    {
      title: "Marketing Manager",
      company: "Growth Co.",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100k - $130k",
      posted: "3 days ago",
      tags: ["Digital Marketing", "SEO", "Content Strategy"],
    },
  ];

  const AnimatedCounter = ({ value }: { value: string }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.5,
    });

    useEffect(() => {
      if (inView) {
        const target = parseInt(value.replace(/\D/g, ""));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, 16);

        return () => clearInterval(timer);
      }
    }, [inView, value]);

    return (
      <span ref={ref}>
        {count}
        {value.includes("K") ? "K+" : value.includes("+") ? "+" : ""}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Find Your Dream Job or
              <span className="block text-blue-100 mt-2">Ideal Candidate</span>
            </motion.h1>
            <motion.p
              className="mt-6 max-w-2xl mx-auto text-xl text-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Connecting talented professionals with leading companies through
              our innovative platform.
            </motion.p>
            {/* Search Bar */}
            <motion.div
              className="mt-10 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Location or remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Search Jobs
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-700 hover:bg-gray-100 shadow-lg"
              >
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-700 bg-transparent"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center text-blue-600">
                  {stat.icon}
                </div>
                <div className="mt-2 text-3xl font-bold text-gray-900">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Job Opportunities
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Explore some of the latest and most popular positions on our
              platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="text-base font-medium text-gray-700 mt-1">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {job.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Posted {job.posted}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button
                        asChild
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Link
                          href={`/jobs/${job.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Link href="/dashboard/user/jobs">
                View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              We provide everything you need for a successful job search or
              recruitment process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-center">{feature.icon}</div>
                    <CardTitle className="text-center text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Explore Job Categories
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Browse thousands of jobs across various industries and
              specializations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        {category.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.jobs} jobs available
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/user/jobs">
                Browse All Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Success Stories
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Hear from professionals who found success through our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
            Join thousands of professionals who have advanced their careers
            through our platform.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-gray-100 shadow-lg"
            >
              <Link href="/register">
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JobMarket</h3>
              <p className="text-gray-400">
                Connecting talent with opportunity since 2023.
              </p>
              <div className="mt-4 flex space-x-4">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                For Job Seekers
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/browse-jobs"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Career Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                For Employers
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/post-job"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recruiters"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Recruiter Solutions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Newsletter
              </h4>
              <p className="text-gray-400 mb-4">
                Subscribe to get the latest job updates and career tips.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none border-gray-700 bg-gray-800 text-white"
                />
                <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2023 JobMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
