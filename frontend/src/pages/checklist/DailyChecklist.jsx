import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { logBehaviorEvent } from '../../utils/behaviorTracker';
import { getFallbackChecklist } from '../../data/checklistTemplates';

const DailyChecklist = () => {
  const { user } = useContext(AuthContext);
  const [checklist, setChecklist] = useState({
    items: [],
    date: new Date().toISOString().split('T')[0],
    isLoading: true,
    error: null
  });
  const [showTips, setShowTips] = useState(false);
  const sessionStartRef = useRef(Date.now());
  const viewLoggedRef = useRef(false);

  // Check if user has access to checklist (only workers and supervisors)
  useEffect(() => {
    if (user && !['worker', 'supervisor'].includes(user.role)) {
      setChecklist(prev => ({
        ...prev,
        isLoading: false,
        error: 'Checklist is only available for workers and supervisors.'
      }));
    }
  }, [user]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };


  useEffect(() => {
    const fetchChecklist = async () => {
      // Handle both _id and id properties from user object
      const userId = user?._id || user?.id;
      
      if (!user || !userId) {
        setChecklist(prev => ({
          ...prev,
          isLoading: false,
          error: 'User not authenticated. Please log in to view your checklist.'
        }));
        return;
      }

      // Check if user has access (only workers and supervisors)
      if (!['worker', 'supervisor'].includes(user.role)) {
        setChecklist(prev => ({
          ...prev,
          isLoading: false,
          error: 'Checklist is only available for workers and supervisors.'
        }));
        return;
      }

      try {
        // Fetch role-based checklist from backend
        const token = localStorage.getItem('token');
        
        if (!token) {
          setChecklist(prev => ({
            ...prev,
            isLoading: false,
            error: 'No authentication token found. Please log in again.'
          }));
          return;
        }
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/checklist/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          setChecklist({
            items: response.data.data.items,
            date: new Date(response.data.data.date).toISOString().split('T')[0],
            checklistId: response.data.data._id,
            userRole: response.data.userRole,
            isLoading: false,
            error: null
          });
          if (!viewLoggedRef.current) {
            logBehaviorEvent('checklist_viewed', {
              checklistId: response.data.data._id,
              totalItems: response.data.data.items.length,
              role: response.data.userRole,
              date: response.data.data.date,
            });
            viewLoggedRef.current = true;
          }
        }
      } catch (error) {
        console.error('Error fetching checklist:', error);
        
        // Use fallback checklist data if backend is unavailable
        const userRole = user?.role || 'worker';
        const currentUserId = user?._id || user?.id || 'guest';
        
        // Check localStorage for previously saved fallback checklist
        const today = new Date().toISOString().split('T')[0];
        const fallbackKey = `checklist_fallback_${currentUserId}_${today}`;
        const savedFallback = localStorage.getItem(fallbackKey);
        
        let fallbackChecklist;
        if (savedFallback) {
          try {
            fallbackChecklist = JSON.parse(savedFallback);
            console.log('Loaded saved fallback checklist from localStorage');
          } catch (e) {
            console.error('Error parsing saved fallback checklist:', e);
            fallbackChecklist = getFallbackChecklist(userRole);
          }
        } else {
          fallbackChecklist = getFallbackChecklist(userRole);
        }
        
        setChecklist({
          items: fallbackChecklist.items || fallbackChecklist.items,
          date: fallbackChecklist.date ? new Date(fallbackChecklist.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          checklistId: fallbackChecklist._id || 'fallback-checklist',
          userRole: userRole,
          isLoading: false,
          error: null,
          isFallback: true // Flag to indicate this is fallback data
        });
        
        toast.warning('Using offline checklist. Some features may be limited.');
        console.log('Using fallback checklist data for role:', userRole);
      }
    };

    fetchChecklist();
  }, [user]);

  const handleCheckItem = async (itemId) => {
    try {
      // Get the current state of the item
      const currentItem = checklist.items.find(item => item._id === itemId);
      const newCompletedState = !currentItem.completed;
      
      // Update UI optimistically
      setChecklist(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item._id === itemId ? { 
            ...item, 
            completed: newCompletedState,
            completedAt: newCompletedState ? new Date() : null
          } : item
        )
      }));

      // If using fallback data, skip backend update
      if (checklist.isFallback) {
        // Store in localStorage for persistence
        const currentUserId = user?._id || user?.id || 'guest';
        const fallbackKey = `checklist_fallback_${currentUserId}_${checklist.date}`;
        const updatedChecklist = {
          ...checklist,
          items: checklist.items.map(item => 
            item._id === itemId ? { 
              ...item, 
              completed: newCompletedState,
              completedAt: newCompletedState ? new Date() : null
            } : item
          )
        };
        localStorage.setItem(fallbackKey, JSON.stringify(updatedChecklist));
        toast.info('Checklist updated locally (offline mode)');
        return;
      }

      // Update the backend
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/checklist/complete`,
        {
          checklistId: checklist.checklistId,
          itemId: itemId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Show success message
        toast.success(response.data.message);
        logBehaviorEvent('checklist_item_completed', {
          checklistId: checklist.checklistId,
          itemId,
          task: currentItem.task,
          category: currentItem.category,
          completed: newCompletedState,
          totalItems: checklist.items.length,
        });

        const isPPEItem = (currentItem.category || '').toLowerCase().includes('ppe') ||
          (currentItem.task || '').toLowerCase().includes('ppe');
        if (isPPEItem) {
          logBehaviorEvent(newCompletedState ? 'ppe_confirmed' : 'ppe_skipped', {
            checklistId: checklist.checklistId,
            itemId,
            task: currentItem.task,
          });
        }
        
        // Check if this was the last item to complete
        const updatedItems = checklist.items.map(item => 
          item._id === itemId ? { ...item, completed: newCompletedState } : item
        );
        
        if (newCompletedState && updatedItems.every(item => item.completed)) {
          // Trigger confetti for completing all items
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
      
      // If using fallback mode, the update already happened locally
      if (checklist.isFallback) {
        // Already handled in the fallback section above
        return;
      }
      
      // Revert the optimistic update (only for backend mode)
      setChecklist(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item._id === itemId ? { ...item, completed: !item.completed } : item
        )
      }));
      toast.error(error.response?.data?.message || 'Failed to update checklist item');
    }
  };

  const calculateProgress = () => {
    if (checklist.items.length === 0) return 0;
    const completedItems = checklist.items.filter(item => item.completed).length;
    return Math.round((completedItems / checklist.items.length) * 100);
  };

  // Show error if user doesn't have access
  if (checklist.error && !['worker', 'supervisor'].includes(user?.role)) {
    return (
      <div className="container mx-auto px-4 py-8 mt-10">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-red-800">Access Restricted</h2>
          </div>
          <p className="text-red-700 mb-4">{checklist.error}</p>
          <p className="text-sm text-red-600">
            The safety checklist is only available for workers and supervisors. 
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  if (checklist.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (checklist.error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <p className="text-red-700">{checklist.error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-6 mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100"
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Daily Safety Checklist</h1>
              {checklist.userRole && (
                <p className="text-sm text-gray-600 mt-1">
                  Role: <span className="font-semibold capitalize">{checklist.userRole.replace('_', ' ')}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center bg-primary-50 px-4 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div 
          className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium text-gray-700">Completion Progress</span>
            </div>
            <span className="text-lg font-bold text-primary-600">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full flex items-center justify-center"
              style={{ width: `${calculateProgress()}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {calculateProgress() > 30 && (
                <span className="text-xs font-bold text-white">{calculateProgress()}%</span>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Checklist Items */}
        <motion.ul 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {checklist.items.map((item, index) => (
            <motion.li 
              key={item._id}
              variants={itemVariants}
              className={`p-5 border rounded-lg transition-all transform hover:scale-[1.01] ${
                item.completed 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start">
                <div className="relative mt-1">
                  <input
                    id={item._id}
                    type="checkbox"
                    checked={item.completed || false}
                    onChange={() => handleCheckItem(item._id)}
                    className="h-6 w-6 text-primary-600 rounded-md focus:ring-primary-500 border-gray-300 cursor-pointer"
                  />
                  {item.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, type: "spring" }}
                      className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <label 
                    htmlFor={item._id}
                    className={`text-base font-medium cursor-pointer block ${
                      item.completed ? 'line-through text-gray-500' : 'text-gray-700'
                    }`}
                  >
                    {item.task}
                  </label>
                  {item.category && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {calculateProgress() === 100 && (
          <motion.div 
            className="mt-8 p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">All Tasks Completed!</h3>
                <p className="text-green-700">
                  Great job! You've completed all safety checks for today. Your commitment to safety is commendable.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="mt-8 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button 
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            onClick={() => {
              if(calculateProgress() === 100) {
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
                const durationSeconds = Math.round((Date.now() - sessionStartRef.current) / 1000);
                logBehaviorEvent('checklist_completed', {
                  checklistId: checklist.checklistId,
                  totalItems: checklist.items.length,
                  completionRate: 100,
                  durationSeconds,
                });
                toast.success("Safety checklist submitted successfully!");
              } else {
                toast.info("Please complete all safety checks before submitting.");
              }
            }}
          >
            Submit Checklist
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DailyChecklist;