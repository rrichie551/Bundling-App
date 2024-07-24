import React, { useState, useRef, useEffect } from 'react';
import { Popover, Button, ActionList, Card } from '@shopify/polaris';

export default function CustomSelect({ option }) {
    const options = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ];
    

  const [popoverActive, setPopoverActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [selectedLabel, setSelectedLabel] = useState(option);
  const togglePopoverActive = () => setPopoverActive((active) => !active);

  const handleSelect = (option) => {
    setSelectedOption(option.value);
    setSelectedLabel(option.label);
    setPopoverActive(false);
  };

  const activator = (
    <Button
        fullWidth
        textAlign="left"
        disclosure='down' onBlur={togglePopoverActive}  tone='success'   >
      {selectedLabel}
    </Button>
  );

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
    >
      <Card>
        <ActionList
          items={options.map((option) => ({
            content: option.label,
            onAction: () => handleSelect(option),
            disabled: selectedOption === option.value,
          }))}
        />
      </Card>
    </Popover>
  );
}

