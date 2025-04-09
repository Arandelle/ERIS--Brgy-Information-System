import { useState } from 'react';

export default function PrivacyPolicy() {
  const [expanded, setExpanded] = useState({});

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: "This Privacy Policy explains how ERIS (Emergency Response and Information System) collects, uses, and protects your personal information when you use our mobile application. By downloading, installing, or using ERIS, you agree to the collection and use of information as described in this policy."
    },
    {
      id: "information-collect",
      title: "Information We Collect",
      content: [
        {
          subtitle: "Account Information",
          items: [
            "Email address (required for login)",
            "Password (securely stored)"
          ]
        },
        {
          subtitle: "Profile Information (Optional)",
          items: [
            "Full name",
            "Age",
            "Home address",
            "Gender",
            "Phone number"
          ]
        },
        {
          subtitle: "Emergency Reports",
          items: [
            "Report details and descriptions",
            "Images and videos (optional)",
            "Location data (required for emergency tracking)",
            "Timestamp of submission"
          ]
        },
        {
          subtitle: "Barangay Certificate Requests",
          items: [
            "Type of certificate requested (clearance, indigency, etc.)",
            "Personal information required for certificate processing"
          ]
        }
      ]
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      content: "We use the collected information for the following purposes:",
      items: [
        "To create and manage your ERIS account",
        "To process and respond to emergency reports",
        "To facilitate barangay certificate requests",
        "To improve the functionality and performance of the app",
        "To communicate with you regarding your reports and requests",
        "To ensure appropriate emergency response by sharing location data with relevant authorities"
      ]
    },
    {
      id: "data-storage",
      title: "Data Storage and Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      content: "We may share your information with:",
      items: [
        "Local barangay officials and emergency responders (for emergency response coordination)",
        "Government agencies (when required for certificate issuance)",
        "Service providers who assist in app functionality and hosting"
      ],
      footer: "We will not sell, trade, or rent your personal information to third parties for marketing purposes."
    },
    {
      id: "user-rights",
      title: "User Rights",
      content: "You have the right to:",
      items: [
        "Access the personal information we hold about you",
        "Correct inaccurate or incomplete information",
        "Delete your account and associated data (subject to legal requirements)",
        "Withdraw consent for optional data collection",
        "Request an export of your data"
      ]
    },
    {
      id: "data-retention",
      title: "Data Retention",
      content: "We retain your information for as long as your account remains active or as needed to provide services. We may retain certain information as required by law or for legitimate business purposes."
    },
    {
      id: "childrens-privacy",
      title: "Children's Privacy",
      content: "ERIS is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we discover we have collected information from a child under 13, we will delete that information immediately."
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last Updated\" date. You are advised to review this Privacy Policy periodically for any changes."
    },
    {
      id: "contact",
      title: "Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at:",
      footer: "topaguintsarandell@gmail.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8">
            <h1 className="text-2xl font-bold text-white text-center">ERIS: Emergency Response and Information System</h1>
            <h2 className="text-xl text-white text-center mt-2">Privacy Policy</h2>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6">
            <div className="mb-8">
              <p className="text-sm text-gray-500 text-right">Last Updated: April 07, 2025</p>
            </div>
            
            {sections.map((section) => (
              <div key={section.id} className="mb-6 border-b border-gray-200 pb-4">
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleSection(section.id)}
                >
                  <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                  <span className="text-blue-500">
                    {expanded[section.id] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </div>
                
                {(expanded[section.id] || section.id === "introduction") && (
                  <div className="mt-2 text-gray-600">
                    {typeof section.content === "string" ? (
                      <p className="mt-2">{section.content}</p>
                    ) : (
                      section.content?.map((item, idx) => (
                        <div key={idx} className="mt-4">
                          <h4 className="font-medium text-gray-800">{item.subtitle}</h4>
                          <ul className="list-disc pl-5 mt-2">
                            {item.items.map((listItem, i) => (
                              <li key={i} className="mt-1">{listItem}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    )}
                    
                    {section.items && (
                      <ul className="list-disc pl-5 mt-2">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="mt-1">{item}</li>
                        ))}
                      </ul>
                    )}
                    
                    {section.footer && (
                      <p className="mt-4 text-gray-700">{section.footer}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-center text-gray-500">
              © 2025 ERIS - Emergency Response and Information System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}