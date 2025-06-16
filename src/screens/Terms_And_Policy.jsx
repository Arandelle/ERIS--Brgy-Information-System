import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../services/firebaseConfig";
import { formatDate } from "../helper/FormatDate";
import Spinner from "../components/ReusableComponents/Spinner";
import AskCard from "../components/ReusableComponents/AskCard";
import logAuditTrail from "../hooks/useAuditTrail";
import icons from "../assets/icons/Icons";
import { useNavigate } from "react-router-dom";

export default function TermsAndPrivacy({ isAdmin = false, TermsOrPrivacy = "privacy-policy" }) {
  const navigation = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSections, setEditingSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  useEffect(() => {
    // Load Terms of service from Firebase when component mounts
    const fetchTermsAndService = async () => {
      setIsLoading(true);
      try {
        const policyRef = ref(database, TermsOrPrivacy);
        const snapshot = await get(policyRef);

        if (snapshot.exists()) {
          const data = snapshot.val();

          const fallbackSection = Array.isArray(data.sections) ? data.sections : defaultSections[TermsOrPrivacy] || [];

          setSections(fallbackSection);
          setLastUpdated(data.lastUpdated || formatDate(new Date()));
        } else {
          // If no data exists, use the default sections
          setSections(defaultSections[TermsOrPrivacy]);
          setLastUpdated(formatDate(new Date()));
        }
      } catch (error) {
        console.error(`Error fetching ${TermsOrPrivacy}:`, error);
        setSections(defaultSections[TermsOrPrivacy]);
        setLastUpdated(formatDate(new Date()));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermsAndService();
  }, [TermsOrPrivacy]);

  useEffect(() => {
    // When entering edit mode, create a copy of sections for editing
    if (isEditing) {
      setEditingSections(JSON.parse(JSON.stringify(sections)));
    }
  }, [isEditing, sections]);

  const toggleSection = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);

      const policyRef = ref(database, TermsOrPrivacy);
      // Save both the sections and the last updated date
      await set(policyRef, {
        sections: editingSections,
        lastUpdated: formattedDate,
      });

      setSections(editingSections);
      setLastUpdated(formattedDate);
      setIsEditing(false);
      await logAuditTrail(`Update the ${TermsOrPrivacy}`);
    } catch (error) {
      console.error(`Error saving ${TermsOrPrivacy}:`, error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const addSection = () => {
    const updatedSection = [...editingSections];
    const newId = `section-${Date.now()}`;
    updatedSection.push({
      id: newId,
      title: "New Section",
      content: "",
      items: [],
      footer: ""
    });
    setEditingSections(updatedSection);
    // Auto-expand the new section
    setExpanded(prev => ({
      ...prev,
      [newId]: true
    }));
  };

  const deleteSection = (index) => {
    setSectionToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteSection = () => {
    if (sectionToDelete !== null) {
      const updated = [...editingSections];
      updated.splice(sectionToDelete, 1);
      setEditingSections(updated);
      setShowDeleteModal(false);
      setSectionToDelete(null);
    }
  };

  const updateSectionTitle = (index, newTitle) => {
    const updated = [...editingSections];
    updated[index].title = newTitle;
    setEditingSections(updated);
  };

  const updateSectionContent = (index, newContent) => {
    const updated = [...editingSections];
    updated[index].content = newContent;
    setEditingSections(updated);
  };

  const updateListItem = (sectionIndex, listIndex, newItem) => {
    const updated = [...editingSections];
    updated[sectionIndex].items[listIndex] = newItem;
    setEditingSections(updated);
  };

  const addListItem = (sectionIndex) => {
    const updated = [...editingSections];
    if (!updated[sectionIndex].items) {
      updated[sectionIndex].items = [];
    }
    updated[sectionIndex].items.push("New item");
    setEditingSections(updated);
  };

  const removeListItem = (sectionIndex, itemIndex) => {
    const updated = [...editingSections];
    updated[sectionIndex].items.splice(itemIndex, 1);
    setEditingSections(updated);
  };

  const updateNestedListItem = (
    sectionIndex,
    contentIndex,
    itemIndex,
    newValue
  ) => {
    const updated = [...editingSections];
    updated[sectionIndex].content[contentIndex].items[itemIndex] = newValue;
    setEditingSections(updated);
  };

  const addNestedListItem = (sectionIndex, contentIndex) => {
    const updated = [...editingSections];
    updated[sectionIndex].content[contentIndex].items.push("New item");
    setEditingSections(updated);
  };

  const removeNestedListItem = (sectionIndex, contentIndex, itemIndex) => {
    const updated = [...editingSections];
    updated[sectionIndex].content[contentIndex].items.splice(itemIndex, 1);
    setEditingSections(updated);
  };

  const updateNestedSubtitle = (sectionIndex, contentIndex, newSubtitle) => {
    const updated = [...editingSections];
    updated[sectionIndex].content[contentIndex].subtitle = newSubtitle;
    setEditingSections(updated);
  };

  const addNestedContent = (sectionIndex) => {
    const updated = [...editingSections];
    if (!Array.isArray(updated[sectionIndex].content)) {
      // Store current string content if it exists
      const oldContent = updated[sectionIndex].content;
      // Initialize content as array
      updated[sectionIndex].content = [];
      
      // If there was old string content, add it as first subsection
      if (oldContent && oldContent.trim() !== "") {
        updated[sectionIndex].content.push({
          subtitle: "General",
          items: [oldContent],
        });
      }
    }

    updated[sectionIndex].content.push({
      subtitle: "New Subsection",
      items: ["New item"],
    });

    setEditingSections(updated);
  };

  const updateSectionFooter = (sectionIndex, newFooter) => {
    const updated = [...editingSections];
    updated[sectionIndex].footer = newFooter;
    setEditingSections(updated);
  };

  const removeNestedContent = (sectionIndex, contentIndex) => {
    const updated = [...editingSections];
    updated[sectionIndex].content.splice(contentIndex, 1);
    
    // If there are no more subsections, convert content back to string
    if (updated[sectionIndex].content.length === 0) {
      updated[sectionIndex].content = "";
    }
    
    setEditingSections(updated);
  };

  // Convert content array to string (useful when only one subsection exists)
  const convertToSimpleContent = (sectionIndex) => {
    const updated = [...editingSections];
    const contentArray = updated[sectionIndex].content;
    
    if (Array.isArray(contentArray) && contentArray.length === 1 && contentArray[0].items.length === 1) {
      updated[sectionIndex].content = contentArray[0].items[0];
    }
    
    setEditingSections(updated);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner loading={isLoading} />
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8">

          <div className="flex flex-row justify-between items-center">
          <button className="text-white" onClick={() => navigation("/")}>
            <icons.arrowLeft fontSize="large"/>
          </button>

              {isAdmin && (
                <div className="flex justify-end mb-4">
                  {isEditing ? (
                    <div className="space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
                    >
                      Edit {TermsOrPrivacy === "privacy-policy" ? "Privacy Policy" : "Terms of Service"}
                    </button>
                  )}
                </div>
              )}
          </div>
         
            
            <h1 className="text-2xl font-bold text-white text-center">
              ERIS: Emergency Response and Information System
            </h1>
            <h2 className="text-xl text-white text-center mt-2">
              {TermsOrPrivacy === "privacy-policy" ? "Privacy Policy" : "Terms of Service"}
            </h2>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="mb-8">
              <p className="text-sm text-gray-500 text-right">
                Last Updated: {lastUpdated}
              </p>
            </div>

            {(isEditing ? editingSections : sections).map(
              (section, sectionIndex) => (
                <div
                  key={section.id || sectionIndex}
                  className="mb-6 border-b border-gray-200 pb-4"
                >
                  <div className="flex justify-between items-center">
                    <div
                      className="flex-grow cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                    >
                      {isEditing ? (
                        <div className="flex items-center">
                          <input
                            className="text-lg font-medium text-gray-900 border-b border-gray-300 w-full mr-4 p-1"
                            value={section.title}
                            onChange={(e) =>
                              updateSectionTitle(sectionIndex, e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ) : (
                        <h3 className="text-lg font-medium text-gray-900">
                          {section.title}
                        </h3>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      {isEditing && (
                        <button
                          onClick={() => deleteSection(sectionIndex)}
                          className="text-red-500 hover:text-red-700 mr-3"
                          title="Delete Section"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                      <span 
                        className="text-blue-500 cursor-pointer"
                        onClick={() => toggleSection(section.id)}
                      >
                        {expanded[section.id] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>

                  {(expanded[section.id] || section.id === "introduction") && (
                    <div className="mt-2 text-gray-600">
                      {/* Text content handling (either string content or converting to complex content) */}
                      {isEditing ? (
                        <div className="mb-4">
                          {typeof section.content === "string" ? (
                            <div className="flex flex-col">
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                                value={section.content || ""}
                                rows={4}
                                onChange={(e) =>
                                  updateSectionContent(sectionIndex, e.target.value)
                                }
                                placeholder="Enter section content (optional)"
                              />
                              <div className="mt-2">
                                <button
                                  onClick={() => addNestedContent(sectionIndex)}
                                  className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Add Subsections Instead
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : typeof section.content === "string" && section.content ? (
                        <p className="mt-2">{section.content}</p>
                      ) : null}

                      {/* Complex subsections with items */}
                      {Array.isArray(section.content) &&
                        section.content.map((item, contentIndex) => (
                          <div key={contentIndex} className="mt-4 border-l-2 border-gray-200 pl-4">
                            <div className="flex justify-between items-center">
                              {isEditing ? (
                                <input
                                  className="font-medium text-gray-800 border-b border-gray-300 w-full p-1"
                                  value={item.subtitle}
                                  onChange={(e) =>
                                    updateNestedSubtitle(
                                      sectionIndex,
                                      contentIndex,
                                      e.target.value
                                    )
                                  }
                                />
                              ) : (
                                <h4 className="font-medium text-gray-800">
                                  {item.subtitle}
                                </h4>
                              )}
                              
                              {isEditing && (
                                <button
                                  onClick={() => removeNestedContent(sectionIndex, contentIndex)}
                                  className="text-red-500 hover:text-red-700 ml-2"
                                  title="Remove Subsection"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                            
                            <ul className="list-disc pl-5 mt-2">
                              {item.items && item.items.map((listItem, itemIndex) => (
                                <li key={itemIndex} className="mt-1">
                                  {isEditing ? (
                                    <div className="flex items-center">
                                      <input
                                        className="flex-grow p-1 border-b border-gray-300"
                                        value={listItem}
                                        onChange={(e) =>
                                          updateNestedListItem(
                                            sectionIndex,
                                            contentIndex,
                                            itemIndex,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <button
                                        onClick={() =>
                                          removeNestedListItem(
                                            sectionIndex,
                                            contentIndex,
                                            itemIndex
                                          )
                                        }
                                        className="ml-2 text-red-500 hover:text-red-700"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  ) : (
                                    listItem
                                  )}
                                </li>
                              ))}
                              {isEditing && (
                                <li className="mt-2">
                                  <button
                                    onClick={() =>
                                      addNestedListItem(
                                        sectionIndex,
                                        contentIndex
                                      )
                                    }
                                    className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Add Item
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}

                      {isEditing && Array.isArray(section.content) && (
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => addNestedContent(sectionIndex)}
                            className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Add Subsection
                          </button>
                          
                          {Array.isArray(section.content) && section.content.length === 1 && (
                            <button
                              onClick={() => convertToSimpleContent(sectionIndex)}
                              className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Convert to Simple Content
                            </button>
                          )}
                        </div>
                      )}

                      {/* Direct items list (without subsections) */}
                      {section.items && section.items.length > 0 && (
                        <div className="mt-4">
                          <ul className="list-disc pl-5 mt-2">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="mt-1">
                                {isEditing ? (
                                  <div className="flex items-center">
                                    <input
                                      className="flex-grow p-1 border-b border-gray-300"
                                      value={item}
                                      onChange={(e) =>
                                        updateListItem(
                                          sectionIndex,
                                          itemIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <button
                                      onClick={() =>
                                        removeListItem(sectionIndex, itemIndex)
                                      }
                                      className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  item
                                )}
                              </li>
                            ))}
                            {isEditing && (
                              <li className="mt-2">
                                <button
                                  onClick={() => addListItem(sectionIndex)}
                                  className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Add Item
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {/* Add items button if no items exist yet */}
                      {isEditing && (!section.items || section.items.length === 0) && (
                        <div className="mt-4">
                          <button
                            onClick={() => addListItem(sectionIndex)}
                            className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Add List Items
                          </button>
                        </div>
                      )}

                      {/* Footer text */}
                      {isEditing ? (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Section Footer (optional)
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded"
                            value={section.footer || ""}
                            placeholder="Add a footer note (optional)"
                            onChange={(e) =>
                              updateSectionFooter(
                                sectionIndex,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ) : section.footer ? (
                        <p className="mt-4 text-gray-700 italic">{section.footer}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              )
            )}

            {isEditing && (
              <button 
                onClick={addSection} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Section
              </button>
            )} 
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-center text-gray-500">
              © {new Date().getFullYear()} ERIS - Emergency Response and Information System. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal &&(
        <AskCard 
          toggleModal={() => setShowDeleteModal(!showDeleteModal)}
          question={"Delete this section?"}
          confirmText={"Delete"}
          onConfirm={confirmDeleteSection}
        />
      )}
      </div>
  );
}

// Default sections data structure - used if no data exists in Firebase
const defaultSectionsOfTOS = [
  {
    id: "introduction",
    title: "Introduction",
    content:
      "Welcome to the Barangay Emergency Response and Information System, a system designed to provide emergency response services to residents of the barangay. By downloading, installing, or using our system, you agree to be bound by these Terms of Service.",
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content:
      "You must be a resident of the barangay to use the primary features of this App. Users must be at least 13 years of age to create an account, with users under 18 requiring parental or guardian consent.",
  },
  {
    id: "account-registration",
    title: "Account Registration",
    content:
      "To access emergency services, you must create an account providing:",
    items: [
      "Email",
      "Password",
      "Fullname",
      "Phone Number (optional)",
      "Residential address within the barangay (optional)",
      "Profile Photo (optional)",
    ],
    footer:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted through your account.",
  },
  {
    id: "legitimate-use",
    title: "Legitimate Use",
    content:
      "This App is designed for genuine emergency situations. You agree to:",
    items: [
      "Only submit legitimate emergency assistance requests",
      "Provide accurate information when creating requests",
      "Not use the App for pranks, false alarms, or non-emergency purposes",
      "Not use the App to harass, threaten, or alarm others",
    ],
    footer:
      "False or prank emergency requests may result in account suspension, termination, and possible legal consequences under local ordinances regarding misuse of emergency services.",
  },
  {
    id: "location-services",
    title: "Location Services",
    content:
      "Our emergency response features require access to your device's location services when submitting assistance requests. You acknowledge that:",
    items: [
      "Location tracking is essential for emergency responders to reach you",
      "Your location will be shared with authorized barangay emergency personnel during active emergency requests",
      "Your location data during emergency situations may be stored for service improvement and record-keeping purposes",
    ],
  },
  {
    id: "media-uploads",
    title: "Media Uploads",
    content:
      "The App allows you to upload photos and videos related to emergency situations. By uploading media, you:",
    items: [
      "Certify that you have the right to share this content",
      "Grant the barangay authorities permission to use this media for emergency response purposes",
      "Understand that uploaded media may be used as evidence in investigations or legal proceedings",
      "Agree not to upload inappropriate, false, or misleading content",
    ],
  },
  {
    id: "service-limitation",
    title: "Service Limitation",
    content:
      "While we strive to provide reliable emergency services, you acknowledge:",
    items: [
      "Response times may vary based on responder availability and circumstances",
      "Service availability depends on network connectivity and device functionality",
      "The App is supplementary to, not a replacement for, national emergency services (like 911)",
      "In life-threatening situations, users should contact national emergency services in addition to using the App",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    content: "We reserve the right to suspend or terminate your account if:",
    items: [
      "You submit false emergency requests",
      "You violate these Terms of Service",
      "You misuse the App for harassment or other prohibited purposes",
      "You provide false personal information",
      "Your continued use poses a risk to community safety",
    ],
  },
  {
    id: "modification",
    title: "Modifications",
    content:
      'We may modify these Terms of Service at any time by posting the revised terms in the App. Your continued use of the App following any changes constitutes acceptance of those changes.',
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content:
      "These Terms shall be governed by and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.",
  },
];

const defaultSectionsOfPP = [
    {
      id: "introduction",
      title: "Introduction",
      content:
        "This Privacy Policy explains how ERIS (Emergency Response and Information System) collects, uses, and protects your personal information when you use our mobile application. By downloading, installing, or using ERIS, you agree to the collection and use of information as described in this policy.",
    },
    {
      id: "information-collect",
      title: "Information We Collect",
      content: [
        {
          subtitle: "Account Information",
          items: [
            "Email address (required for login)",
            "Password (securely stored)",
          ],
        },
        {
          subtitle: "Profile Information (Optional)",
          items: ["Full name", "Age", "Home address", "Gender", "Phone number"],
        },
        {
          subtitle: "Emergency Reports",
          items: [
            "Report details and descriptions",
            "Images and videos (optional)",
            "Location data (required for emergency tracking)",
            "Timestamp of submission",
          ],
        },
        {
          subtitle: "Barangay Certificate Requests",
          items: [
            "Type of certificate requested (clearance, indigency, etc.)",
            "Personal information required for certificate processing",
          ],
        },
      ],
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
        "To ensure appropriate emergency response by sharing location data with relevant authorities",
      ],
    },
    {
      id: "data-storage",
      title: "Data Storage and Security",
      content:
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      content: "We may share your information with:",
      items: [
        "Local barangay officials and emergency responders (for emergency response coordination)",
        "Government agencies (when required for certificate issuance)",
        "Service providers who assist in app functionality and hosting",
      ],
      footer:
        "We will not sell, trade, or rent your personal information to third parties for marketing purposes.",
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
        "Request an export of your data",
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      content:
        "We retain your information for as long as your account remains active or as needed to provide services. We may retain certain information as required by law or for legitimate business purposes.",
    },
    {
      id: "childrens-privacy",
      title: "Children's Privacy",
      content:
        "ERIS is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we discover we have collected information from a child under 13, we will delete that information immediately.",
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      content:
        'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.',
    },
    {
      id: "contact",
      title: "Contact Us",
      content:
        "If you have any questions about this Privacy Policy, please contact us at:",
      footer: "topaguintsarandell@gmail.com",
    },
  ];

const defaultSections = {
    "privacy-policy" : [...defaultSectionsOfPP],
    "terms-of-service": [...defaultSectionsOfTOS]
};
  
