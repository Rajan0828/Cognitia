import React, { useState, useEffect } from "react";
import Spinner from "../../components/Common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
} from "lucide-react";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        console.log("Data__getDashboardData", data);

        setDashboardData(data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <TrendingUp className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-400 to-cyan-500",
      shadowColor: "shadow-blue-500/25",
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-500",
      shadowColor: "shadow-purple-500/25",
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-teal-500",
      shadowColor: "shadow-emerald-500/25",
    },
  ];
  return (
    <div className="min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="mb-2 text-xl font-medium tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Track your learning progress and activity
          </p>
        </div>

        {/* STATS GRID */}
        <div className="mb-5 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  {stat.label}
                </span>
                <div
                  className={`h-11 w-11 rounded-xl bg-linear-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <stat.icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
              </div>
              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* RECENT ACTIVITY SECTION */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200">
              <Clock className="h-5 w-5 text-slate-600" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-medium tracking-tight text-slate-900">
              Recent Activity
            </h3>
          </div>
          {dashboardData.recentActivity &&
          (dashboardData.recentActivity.documents.length > 0 ||
            dashboardData.recentActivity.quizzes.length > 0) ? (
            <div className="space-y-3">
              {[
                ...(dashboardData.recentActivity.documents || []).map(
                  (doc) => ({
                    id: doc._id,
                    description: doc.title,
                    timestamp: doc.lastAccessed,
                    link: `/documents/${doc._id}`,
                    type: "document",
                  }),
                ),
                ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                  id: quiz._id,
                  description: quiz.title,
                  timestamp: quiz.lastAccessed,
                  link: `/quizzes/${quiz._id}`,
                  type: "quiz",
                })),
              ]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="group flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 transition-all duration-200 hover:border-slate-300/60 hover:bg-white hover:shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            activity.type === "document"
                              ? "bg-linear-to-r from-blue-400 to-cyan-500"
                              : "bg-linear-to-r from-emerald-400 to-teal-500"
                          }`}
                        />
                        <p className="truncate text-sm font-medium text-slate-900">
                          {activity.type === "document"
                            ? "Accessed Document: "
                            : "Attempted Quizzes: "}
                          <span className="">{activity.description}</span>
                        </p>
                      </div>
                      <p className="pl-4 text-xs text-slate-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {activity.link && (
                      <a
                        href={activity.link}
                        className="ml-4 rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap text-emerald-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Clock className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600">No recent activity.</p>
              <p className="mt-1 text-xs text-slate-500">
                Start learning to track your progress!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
