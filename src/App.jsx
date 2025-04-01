import React, { useState, useEffect } from 'react';
import './App.css';
import ReadmeComponent from './ReadmeComponent';
import { Tabs, Tab, Box, Link } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import GitHubIcon from '@mui/icons-material/GitHub';
function App() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  // For mobile optimization
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState("usage");
  useEffect(() => {
    fetchTemplates();

    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));

    // Handle resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [darkMode]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://resend-template-backend.vercel.app/api/templates/');

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json();
      setTemplates(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const extractVariables = (html) => {
    const regex = /{{([^}]+)}}/g;
    const matches = html.match(regex) || [];
    return [...new Set(matches.map(match => match.replace(/{{|}}/g, '')))];
  };

  const generateUsageCode = (template) => {
    const variables = extractVariables(template.html);

    // Convert variables to JavaScript object format
    const variablesObj = variables.reduce((acc, variable) => {
      acc[variable] = `'${variable === 'year' ? new Date().getFullYear() : `Replace ${variable} here`}'`;
      return acc;
    }, {});

    // Ensure subject is included in variables
    if (!variablesObj.subject && template.subject) {
      variablesObj.subject = `'${template.subject}'`;
    }

    // Format the variables object as a string
    const variablesStr = JSON.stringify(variablesObj, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, "'");

    // Return more compact code for mobile
    if (isMobile) {
      return `const apiKey = 'your_api_key'; 
const from = 'your-email@example.com'; 
const to = 'recipient@example.com'; 
const templateId = '${template.templateId}'; 
const variables = ${variablesStr};

sendTemplateEmail({ 
  apiKey, 
  from, 
  to, 
  templateId, 
  variables 
})
.then(response => console.log('Email sent:', response))
.catch(err => console.error('Error:', err));`;
    }

    // Regular code for larger screens
    return `const apiKey = 'your_resend_api_key'; // Resend API Key
const from = 'your-email@example.com'; // Sender email address
const to = 'recipient@example.com'; // Recipient email address
const templateId = '${template.templateId}'; // Template ID from your backend
const variables = ${variablesStr};

sendTemplateEmail({ apiKey, from, to, templateId, variables })
  .then(response => {
    console.log('Email sent successfully:', response);
  })
  .catch(err => {
    console.error('Error sending email:', err);
  });`;
  };

  const handleCardClick = (template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    // Use a more mobile-friendly notification instead of alert
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  };

  if (loading) return (
    <div className={`loading-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="loader"></div>
      <p>Loading templates...</p>
    </div>
  );

  if (error) return (
    <div className={`error-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="error-icon">!</div>
      <p>Error: {error}</p>
      <button className="retry-btn" onClick={fetchTemplates}>Retry</button>
    </div>
  );

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header>
        <div className="header-content">
          <h1>resend-template</h1>
          <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
            <Link href="https://www.npmjs.com/package/resend-template" marginTop="10px"> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAKlBMVEXLAADKAADMExPVTU3USUn////eenrghobfgYHst7fFAADJAADhi4vPJibZA+ujAAAAUklEQVR4AWMgETAKQoEAmKvsAgVGYEnTUCgIFmBgYmAQgOtiAHERACdXSNkBmevi/AGZyxrwAU3v4OJ+gLACGP7DA8dZgOGyixEi6ECUAIlhDgBlbQ7lGaBp1QAAAABJRU5ErkJggg==" alt="" /></Link>
            <button
              className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <LightModeIcon style={{ color: "white" }} /> : <DarkModeIcon />}
            </button>
          </Box>
        </div>
        <p className="header-desc">Select a template to view usage code</p>
      </header>

      <div className="templates-container">
        {templates.map(template => (
          <div
            className="template-card"
            key={template._id}
            onClick={() => handleCardClick(template)}
          >
            <div className="card-header">
              <h2>{template.templateId}</h2>
            </div>
            <div className="card-content">
              <p className="subject">
                <span className="label">Subject:</span>
                {template.subject}
              </p>
              <div className="variables">
                <h3>Variables:</h3>
                <ul>
                  {extractVariables(template.html).map(variable => (
                    <li key={variable}>{variable}</li>
                  ))}
                </ul>
              </div>
              <button className="view-btn">View Usage</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedTemplate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTemplate.templateId}</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>

            <Box sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                centered
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: "bold",
                    textTransform: "none",
                  },
                  "& .MuiTabs-indicator": {
                    height: 3, // Thick indicator for better visibility
                  },
                }}
                style={{ display: 'flex', justifyContent: 'start' }}
              >
                <Tab label="Usage" value="usage" />
                <Tab label="Preview" value="preview" />
              </Tabs>
            </Box>
            <div className="modal-content">
              {activeTab === "usage" ? (
                <div>
                  <h3>Usage Example:</h3>
                  <div className="code-container">
                    <pre className="code-block">
                      <code>{generateUsageCode(selectedTemplate)}</code>
                    </pre>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopyCode(generateUsageCode(selectedTemplate))}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="important-note">
                    <h3>Important Notes:</h3>
                    <ul>
                      <li>Subject is required for all templates</li>
                      <li>All variables must be provided</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="html-preview-container">
                  <h3>Template Preview:</h3>
                  <div className="html-preview" dangerouslySetInnerHTML={{ __html: selectedTemplate.html }}></div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}


      <ReadmeComponent darkMode={darkMode} />
      <p className="header-desc" style={{ textAlign: 'center', marginTop: '20px' }}>
        Made with ❤️ by <a href="https://github.com/Dcode36" target="_blank" rel="noopener noreferrer">Dcode36</a>
      </p>
    </div>
  );
}

export default App;