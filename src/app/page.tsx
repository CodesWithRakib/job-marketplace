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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/auth-slice";
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
} from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  useEffect(() => {
    if (session) {
      dispatch(setUser(session.user));
    }
  }, [session, dispatch]);

  const features = [
    {
      icon: <Search className="h-8 w-8 text-indigo-600" />,
      title: "Smart Job Search",
      description:
        "Find jobs that match your skills and preferences with our intelligent search algorithm.",
    },
    {
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      title: "Easy Applications",
      description:
        "Apply to multiple jobs with a single profile and track your application status.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      title: "Direct Messaging",
      description:
        "Communicate directly with recruiters and employers through our platform.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      title: "Analytics Dashboard",
      description:
        "Track your job search progress with detailed analytics and insights.",
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Secure Platform",
      description:
        "Your data is protected with enterprise-grade security measures.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
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
    },
    {
      name: "Michael Chen",
      role: "HR Manager",
      company: "Innovate Inc",
      content:
        "We've found amazing candidates through this platform. The quality of applicants is outstanding.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Specialist",
      company: "Creative Solutions",
      content:
        "The direct messaging feature made it so easy to connect with potential employers. Highly recommend!",
      rating: 4,
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
    { name: "Technology", icon: <Briefcase className="h-8 w-8" />, jobs: 1240 },
    { name: "Marketing", icon: <Briefcase className="h-8 w-8" />, jobs: 890 },
    { name: "Design", icon: <Briefcase className="h-8 w-8" />, jobs: 650 },
    { name: "Sales", icon: <Briefcase className="h-8 w-8" />, jobs: 1120 },
    { name: "Finance", icon: <Briefcase className="h-8 w-8" />, jobs: 780 },
    { name: "Healthcare", icon: <Briefcase className="h-8 w-8" />, jobs: 920 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Find Your Dream Job or
              <span className="block text-indigo-200 mt-2">
                Ideal Candidate
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              Connecting talented professionals with leading companies through
              our innovative platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-indigo-700 hover:bg-gray-100"
              >
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-indigo-700"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center text-indigo-600">
                  {stat.icon}
                </div>
                <div className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
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
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
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
              <Card
                key={index}
                className="hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
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
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
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
              <Card key={index} className="border-0 shadow-lg">
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
                  <div>
                    <p className="font-medium text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-100">
            Join thousands of professionals who have advanced their careers
            through our platform.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="bg-white text-indigo-700 hover:bg-gray-100"
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
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                For Job Seekers
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/browse-jobs"
                    className="text-gray-400 hover:text-white"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="text-gray-400 hover:text-white"
                  >
                    Career Resources
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
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
                    className="text-gray-400 hover:text-white"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-400 hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recruiters"
                    className="text-gray-400 hover:text-white"
                  >
                    Recruiter Solutions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
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
