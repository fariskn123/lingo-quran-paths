
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuranicPathPage from './QuranicPathPage';

const LevelsPage = () => {
  const navigate = useNavigate();
  
  // Redirect to the root path which now renders QuranicPathPage
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  
  return null;
};

export default LevelsPage;
