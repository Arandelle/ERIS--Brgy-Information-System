import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Button } from '@mui/material';
import ButtonStyle from '../../components/ReusableComponents/Button';
import icons from '../../assets/icons/Icons';

const FilterModal = ({ isOpen, onClose, onApplyFilter, currentFilters }) => {
  const [selectedStatuses, setSelectedStatuses] = useState(currentFilters || []);
  
  // Available status options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'on-going', label: 'On-going' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'expired', label: 'Expired' },
    { value: 'reported', label: 'Reported' }
  ];

  useEffect(() => {
    setSelectedStatuses(currentFilters || []);
  }, [currentFilters]);

  const handleStatusChange = (status) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedStatuses);
    onClose();
  };

  const handleClearFilter = () => {
    setSelectedStatuses([]);
    onApplyFilter([]);
    onClose();
  };

  const handleSelectAll = () => {
    if (selectedStatuses.length === statusOptions.length) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses(statusOptions.map(option => option.value));
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-lg"
      }}
    >
      <DialogTitle className="text-lg font-semibold border-b pb-3">
        Filter by Status
      </DialogTitle>
      
      <DialogContent className="py-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">
              Select Status ({selectedStatuses.length} selected)
            </span>
            <Button
              size="small"
              onClick={handleSelectAll}
              className="text-blue-600 hover:text-blue-800"
            >
              {selectedStatuses.length === statusOptions.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={selectedStatuses.includes(option.value)}
                    onChange={() => handleStatusChange(option.value)}
                    color="primary"
                  />
                }
                label={
                  <span className="text-sm font-medium capitalize">
                    {option.label}
                  </span>
                }
                className="w-full"
              />
            ))}
          </div>
        </div>
      </DialogContent>
      
      <DialogActions className="border-t pt-3 px-6 pb-4">
        <div className="flex gap-2 w-full justify-end">
          <ButtonStyle
          icon={icons.cancel}
            label="Clear"
            color="gray"
            fontSize="small"
            onClick={handleClearFilter}
          />
          <ButtonStyle
           icon={icons.cancel}
            label="Cancel"
            color="gray"
            fontSize="small"
            onClick={onClose}
          />
          <ButtonStyle
            icon={icons.filter}
            label="Apply Filter"
            color="blue"
            fontSize="small"
            onClick={handleApplyFilter}
            
          />
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;