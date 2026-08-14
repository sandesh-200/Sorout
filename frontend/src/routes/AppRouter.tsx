// import { Routes, Route, Navigate } from "react-router-dom";

// import LoginPage from "@/pages/LoginPage";
// import SignupPage from "@/pages/SignupPage";



// import { ProtectedRoute } from "./ProtectedRoute";


// import AdminLayout from "@/layouts/AdminLayout";
// import Interviews from "@/pages/admin/Interviews";
// import CandidateLayout from "@/layouts/CandidateLayout";
// import CandidateInterviews from "@/pages/candidate/CandidateInterviews";
// import InterviewInstructionsPage from "@/pages/candidate/InterviewInstructionsPage";
// import InterviewResultPage from "@/pages/candidate/InterviewResultPage";
// import ConversationalWorkspace from "@/pages/candidate/ConversationalWorkspace";
// import LandingPage from "@/pages/marketing/LandingPage";

// const AnalyticsPage = () => (
//   <div className="space-y-2">
//     <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
//     <p className="text-muted-foreground">Welcome back!</p>
//   </div>
// );

// const PlaceholderPage = ({ title }: { title: string }) => (
//   <div className="space-y-2">
//     <h1 className="text-2xl font-bold">{title}</h1>
//     <p className="text-muted-foreground">This page is under construction.</p>
//   </div>
// );

// const UnauthorizedPage = () => (
//   <div className="flex h-screen items-center justify-center">
//     <h1 className="text-2xl font-semibold">
//       Unauthorized
//     </h1>
//   </div>
// );

// export default function AppRouter() {
//   return (
//     <Routes>
//       {/* Redirect */}
//       <Route
//         path="/"
//         element={<LandingPage/>}
//       />

//       {/* Public */}
//       <Route
//         path="/login"
//         element={<LoginPage />}
//       />

//       <Route
//         path="/signup"
//         element={<SignupPage />}
//       />

//       <Route
//         path="/unauthorized"
//         element={<UnauthorizedPage />}
//       />

//       {/* ---------------- ADMIN ---------------- */}

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <AdminLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Navigate to="/admin/dashboard" replace />} />

//         <Route
//           path="/admin/dashboard"
//           element={<AnalyticsPage />}
//         />

//         <Route
//           path="/admin/interviews"
//           element={<Interviews />}
//         />
        
//         <Route
//           path="/admin/candidates"
//           element={<PlaceholderPage title="Candidates" />}
//         />

//         <Route
//           path="/admin/settings"
//           element={<PlaceholderPage title="Admin Settings" />}
//         />
//       </Route>

//       {/* ---------------- CANDIDATE ---------------- */}

//       <Route
//         element={
//           <ProtectedRoute
//             allowedRoles={["candidate"]}
//           >
//             <CandidateLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Navigate to="/candidate/interviews" replace />} />

//         <Route
//           path="/candidate/interviews"
//           element={<CandidateInterviews />}
//         />

//         <Route
//           path="/candidate/profile"
//           element={<PlaceholderPage title="Candidate Profile" />}
//         />

//         <Route
//           path="/candidate/settings"
//           element={<PlaceholderPage title="Candidate Settings" />}
//         />

//         <Route path="/candidate/interviews/:sessionId/instructions" element={<InterviewInstructionsPage />} />
//       </Route>

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["candidate"]}>
//             <ConversationalWorkspace />
//           </ProtectedRoute>
//         }
//         path="/candidate/workspace/:sessionId"
//       />

//       <Route
//         element={
//           <ProtectedRoute allowedRoles={["candidate"]}>
//             <InterviewResultPage />
//           </ProtectedRoute>
//         }
//         path="/candidate/result/:sessionId"
//       />

//       {/* Must be last — catches all unknown paths */}
//       <Route
//         path="*"
//         element={<Navigate to="/login" replace />}
//       />
//     </Routes>
//   );
// }


import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

import { ProtectedRoute } from "./ProtectedRoute";

import AdminLayout from "@/layouts/AdminLayout";
import Interviews from "@/pages/admin/Interviews";
import CandidateLayout from "@/layouts/CandidateLayout";
import CandidateInterviews from "@/pages/candidate/CandidateInterviews";
import InterviewInstructionsPage from "@/pages/candidate/InterviewInstructionsPage";
import InterviewResultPage from "@/pages/candidate/InterviewResultPage";
import ConversationalWorkspace from "@/pages/candidate/ConversationalWorkspace";
import LandingPage from "@/pages/marketing/LandingPage";

const AnalyticsPage = () => (
	<div className="space-y-2">
		<h1 className="text-2xl font-bold">Analytics Dashboard</h1>
		<p className="text-muted-foreground">Welcome back!</p>
	</div>
);

const PlaceholderPage = ({ title }: { title: string }) => (
	<div className="space-y-2">
		<h1 className="text-2xl font-bold">{title}</h1>
		<p className="text-muted-foreground">This page is under construction.</p>
	</div>
);

const UnauthorizedPage = () => (
	<div className="flex h-screen items-center justify-center">
		<h1 className="text-2xl font-semibold">Unauthorized</h1>
	</div>
);

export default function AppRouter() {
	return (
		<Routes>
			{/* Public / Landing */}
			<Route path="/" element={<LandingPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/signup" element={<SignupPage />} />
			<Route path="/unauthorized" element={<UnauthorizedPage />} />

			{/* ---------------- ADMIN ---------------- */}
			<Route
				path="admin"
				element={
					<ProtectedRoute allowedRoles={["admin"]}>
						<AdminLayout />
					</ProtectedRoute>
				}
			>
				{/* Matches /admin */}
				<Route index element={<Navigate to="/admin/dashboard" replace />} />
				<Route path="dashboard" element={<AnalyticsPage />} />
				<Route path="interviews" element={<Interviews />} />
				<Route path="candidates" element={<PlaceholderPage title="Candidates" />} />
				<Route path="settings" element={<PlaceholderPage title="Admin Settings" />} />
			</Route>

			{/* ---------------- CANDIDATE ---------------- */}
			<Route
				path="candidate"
				element={
					<ProtectedRoute allowedRoles={["candidate"]}>
						<CandidateLayout />
					</ProtectedRoute>
				}
			>
				{/* Matches /candidate */}
				<Route index element={<Navigate to="/candidate/interviews" replace />} />
				<Route path="interviews" element={<CandidateInterviews />} />
				<Route path="profile" element={<PlaceholderPage title="Candidate Profile" />} />
				<Route path="settings" element={<PlaceholderPage title="Candidate Settings" />} />
				<Route path="interviews/:sessionId/instructions" element={<InterviewInstructionsPage />} />
			</Route>

			{/* Full-screen Candidate routes outside CandidateLayout */}
			<Route
				path="/candidate/workspace/:sessionId"
				element={
					<ProtectedRoute allowedRoles={["candidate"]}>
						<ConversationalWorkspace />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/candidate/result/:sessionId"
				element={
					<ProtectedRoute allowedRoles={["candidate"]}>
						<InterviewResultPage />
					</ProtectedRoute>
				}
			/>

			{/* Catch-all fallback */}
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}