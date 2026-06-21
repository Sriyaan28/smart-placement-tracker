const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Hooks
  { from: /['"]\.\.\/hooks\/useApplications['"]/g, to: "'../hooks/student/useApplications'" },
  { from: /['"]\.\.\/\.\.\/hooks\/useApplications['"]/g, to: "'../../hooks/student/useApplications'" },
  { from: /['"]\.\/hooks\/useApplications['"]/g, to: "'./hooks/student/useApplications'" },

  { from: /['"]\.\.\/hooks\/useJobs['"]/g, to: "'../hooks/student/useJobs'" },
  { from: /['"]\.\.\/\.\.\/hooks\/useJobs['"]/g, to: "'../../hooks/student/useJobs'" },
  { from: /['"]\.\/hooks\/useJobs['"]/g, to: "'./hooks/student/useJobs'" },

  { from: /['"]\.\.\/hooks\/useCompany['"]/g, to: "'../hooks/company/useCompany'" },
  { from: /['"]\.\.\/\.\.\/hooks\/useCompany['"]/g, to: "'../../hooks/company/useCompany'" },
  { from: /['"]\.\/hooks\/useCompany['"]/g, to: "'./hooks/company/useCompany'" },

  { from: /['"]\.\.\/hooks\/useAuth['"]/g, to: "'../hooks/auth/useAuth'" },
  { from: /['"]\.\.\/\.\.\/hooks\/useAuth['"]/g, to: "'../../hooks/auth/useAuth'" },
  { from: /['"]\.\/hooks\/useAuth['"]/g, to: "'./hooks/auth/useAuth'" },
  { from: /['"]\.\.\/\.\.\/\.\.\/hooks\/useAuth['"]/g, to: "'../../../hooks/auth/useAuth'" },

  { from: /['"]\.\.\/hooks\/useProfile['"]/g, to: "'../hooks/common/useProfile'" },
  { from: /['"]\.\.\/\.\.\/hooks\/useProfile['"]/g, to: "'../../hooks/common/useProfile'" },
  { from: /['"]\.\/hooks\/useProfile['"]/g, to: "'./hooks/common/useProfile'" },

  { from: /['"]\.\.\/hooks\/useStats['"]/g, to: "'../hooks/common/useStats'" },
  { from: /['"]\.\.\/\.\.\/hooks\/useStats['"]/g, to: "'../../hooks/common/useStats'" },
  { from: /['"]\.\/hooks\/useStats['"]/g, to: "'./hooks/common/useStats'" },

  // Contexts
  { from: /['"]\.\.\/context\/ApplicationsContext['"]/g, to: "'../context/student/ApplicationsContext'" },
  { from: /['"]\.\.\/\.\.\/context\/ApplicationsContext['"]/g, to: "'../../context/student/ApplicationsContext'" },
  { from: /['"]\.\/context\/ApplicationsContext['"]/g, to: "'./context/student/ApplicationsContext'" },

  { from: /['"]\.\.\/context\/JobsContext['"]/g, to: "'../context/student/JobsContext'" },
  { from: /['"]\.\.\/\.\.\/context\/JobsContext['"]/g, to: "'../../context/student/JobsContext'" },
  { from: /['"]\.\/context\/JobsContext['"]/g, to: "'./context/student/JobsContext'" },

  { from: /['"]\.\.\/context\/CompanyContext['"]/g, to: "'../context/company/CompanyContext'" },
  { from: /['"]\.\.\/\.\.\/context\/CompanyContext['"]/g, to: "'../../context/company/CompanyContext'" },
  { from: /['"]\.\/context\/CompanyContext['"]/g, to: "'./context/company/CompanyContext'" },

  { from: /['"]\.\.\/context\/AuthContext['"]/g, to: "'../context/auth/AuthContext'" },
  { from: /['"]\.\.\/\.\.\/context\/AuthContext['"]/g, to: "'../../context/auth/AuthContext'" },
  { from: /['"]\.\/context\/AuthContext['"]/g, to: "'./context/auth/AuthContext'" },
  { from: /['"]\.\.\/\.\.\/\.\.\/context\/AuthContext['"]/g, to: "'../../../context/auth/AuthContext'" },

  { from: /['"]\.\.\/context\/ProfileContext['"]/g, to: "'../context/common/ProfileContext'" },
  { from: /['"]\.\.\/\.\.\/context\/ProfileContext['"]/g, to: "'../../context/common/ProfileContext'" },
  { from: /['"]\.\/context\/ProfileContext['"]/g, to: "'./context/common/ProfileContext'" },

  { from: /['"]\.\.\/context\/StatsContext['"]/g, to: "'../context/common/StatsContext'" },
  { from: /['"]\.\.\/\.\.\/context\/StatsContext['"]/g, to: "'../../context/common/StatsContext'" },
  { from: /['"]\.\/context\/StatsContext['"]/g, to: "'./context/common/StatsContext'" },

  // Components - Utils to Common
  { from: /['"]\.\.\/components\/utils\/(.*)['"]/g, to: "'../components/common/$1'" },
  { from: /['"]\.\.\/\.\.\/components\/utils\/(.*)['"]/g, to: "'../../components/common/$1'" },
  { from: /['"]\.\/components\/utils\/(.*)['"]/g, to: "'./components/common/$1'" },
  
  // Components - Auth (from old to auth, but it was already in auth, except ProtectedRoute)
  { from: /['"]\.\.\/components\/ProtectedRoute['"]/g, to: "'../components/auth/ProtectedRoute'" },
  { from: /['"]\.\.\/\.\.\/components\/ProtectedRoute['"]/g, to: "'../../components/auth/ProtectedRoute'" },
  { from: /['"]\.\/components\/ProtectedRoute['"]/g, to: "'./components/auth/ProtectedRoute'" },
  
  // Components - Profile stats -> Common
  { from: /['"]\.\.\/components\/profile\/stats\/(.*)['"]/g, to: "'../components/common/$1'" },
  { from: /['"]\.\.\/\.\.\/components\/profile\/stats\/(.*)['"]/g, to: "'../../components/common/$1'" },
  { from: /['"]\.\.\/\.\.\/\.\.\/components\/profile\/stats\/(.*)['"]/g, to: "'../../../components/common/$1'" },

  // Components - Profile direct children (PdfViewer, ReadOnlyResume) -> Common
  { from: /['"]\.\.\/components\/profile\/PdfViewer['"]/g, to: "'../components/common/PdfViewer'" },
  { from: /['"]\.\.\/\.\.\/components\/profile\/PdfViewer['"]/g, to: "'../../components/common/PdfViewer'" },
  { from: /['"]\.\.\/components\/profile\/ReadOnlyResume['"]/g, to: "'../components/common/ReadOnlyResume'" },
  { from: /['"]\.\.\/\.\.\/components\/profile\/ReadOnlyResume['"]/g, to: "'../../components/common/ReadOnlyResume'" },
  
  // Components - Profile student -> student
  { from: /['"]\.\.\/components\/profile\/student\/(.*)['"]/g, to: "'../components/student/$1'" },
  { from: /['"]\.\.\/\.\.\/components\/profile\/student\/(.*)['"]/g, to: "'../../components/student/$1'" },
  
  // Components - Profile company -> company
  { from: /['"]\.\.\/components\/profile\/company\/(.*)['"]/g, to: "'../components/company/$1'" },
  { from: /['"]\.\.\/\.\.\/components\/profile\/company\/(.*)['"]/g, to: "'../../components/company/$1'" },

  // Components - Profile admin -> admin
  { from: /['"]\.\.\/components\/profile\/admin\/(.*)['"]/g, to: "'../components/admin/$1'" },
  { from: /['"]\.\.\/\.\.\/components\/profile\/admin\/(.*)['"]/g, to: "'../../components/admin/$1'" },

  // Pages
  { from: /['"]\.\.\/pages\/StudentHome['"]/g, to: "'../pages/student/StudentHome'" },
  { from: /['"]\.\/pages\/StudentHome['"]/g, to: "'./pages/student/StudentHome'" },
  { from: /['"]\.\.\/pages\/MyApplications['"]/g, to: "'../pages/student/MyApplications'" },
  { from: /['"]\.\/pages\/MyApplications['"]/g, to: "'./pages/student/MyApplications'" },
  { from: /['"]\.\.\/pages\/SearchJobs['"]/g, to: "'../pages/student/SearchJobs'" },
  { from: /['"]\.\/pages\/SearchJobs['"]/g, to: "'./pages/student/SearchJobs'" },
  { from: /['"]\.\.\/pages\/ApplicationDetails['"]/g, to: "'../pages/student/ApplicationDetails'" },
  { from: /['"]\.\/pages\/ApplicationDetails['"]/g, to: "'./pages/student/ApplicationDetails'" },

  { from: /['"]\.\.\/pages\/CompanyHome['"]/g, to: "'../pages/company/CompanyHome'" },
  { from: /['"]\.\/pages\/CompanyHome['"]/g, to: "'./pages/company/CompanyHome'" },
  { from: /['"]\.\.\/pages\/CompanyApplications['"]/g, to: "'../pages/company/CompanyApplications'" },
  { from: /['"]\.\/pages\/CompanyApplications['"]/g, to: "'./pages/company/CompanyApplications'" },
  { from: /['"]\.\.\/pages\/CompanyApplicationDetails['"]/g, to: "'../pages/company/CompanyApplicationDetails'" },
  { from: /['"]\.\/pages\/CompanyApplicationDetails['"]/g, to: "'./pages/company/CompanyApplicationDetails'" },
  { from: /['"]\.\.\/pages\/PostJob['"]/g, to: "'../pages/company/PostJob'" },
  { from: /['"]\.\/pages\/PostJob['"]/g, to: "'./pages/company/PostJob'" },
  { from: /['"]\.\.\/pages\/EditJob['"]/g, to: "'../pages/company/EditJob'" },
  { from: /['"]\.\/pages\/EditJob['"]/g, to: "'./pages/company/EditJob'" },
  { from: /['"]\.\.\/pages\/SearchStudents['"]/g, to: "'../pages/company/SearchStudents'" },
  { from: /['"]\.\/pages\/SearchStudents['"]/g, to: "'./pages/company/SearchStudents'" },

  { from: /['"]\.\.\/pages\/AuthPage['"]/g, to: "'../pages/auth/AuthPage'" },
  { from: /['"]\.\/pages\/AuthPage['"]/g, to: "'./pages/auth/AuthPage'" },

  { from: /['"]\.\.\/pages\/HomePage['"]/g, to: "'../pages/common/HomePage'" },
  { from: /['"]\.\/pages\/HomePage['"]/g, to: "'./pages/common/HomePage'" },
  { from: /['"]\.\.\/pages\/LandingPage['"]/g, to: "'../pages/common/LandingPage'" },
  { from: /['"]\.\/pages\/LandingPage['"]/g, to: "'./pages/common/LandingPage'" },
  { from: /['"]\.\.\/pages\/ProfilePage['"]/g, to: "'../pages/common/ProfilePage'" },
  { from: /['"]\.\/pages\/ProfilePage['"]/g, to: "'./pages/common/ProfilePage'" },
  { from: /['"]\.\.\/pages\/JobDetails['"]/g, to: "'../pages/common/JobDetails'" },
  { from: /['"]\.\/pages\/JobDetails['"]/g, to: "'./pages/common/JobDetails'" },
  { from: /['"]\.\.\/pages\/CompanyPublicProfile['"]/g, to: "'../pages/common/CompanyPublicProfile'" },
  { from: /['"]\.\/pages\/CompanyPublicProfile['"]/g, to: "'./pages/common/CompanyPublicProfile'" },
  { from: /['"]\.\.\/pages\/Stats['"]/g, to: "'../pages/common/Stats'" },
  { from: /['"]\.\/pages\/Stats['"]/g, to: "'./pages/common/Stats'" }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rep of replacements) {
        content = content.replace(rep.from, rep.to);
      }
      
      // Also fix absolute path style relative to current directory if moved 1 level deeper
      // For any file that moved from e.g. pages/ to pages/student/, all its ../ imports need to become ../../
      // Wait, that is too dynamic to do regex. But let's check App.jsx first, it usually has most imports.
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDirectory(srcDir);
