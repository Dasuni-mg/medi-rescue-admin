import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Popover,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';

const PermAccordion = ({ permissions, enableCheckboxes }) => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popupContent, setPopupContent] = useState('');
  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'description-popover' : undefined;
  const theme = useTheme();

  useEffect(() => {
    setData(permissions);
  }, [permissions]);

  // Panel Heading Check Status Handling
  const handleHeaderCheckboxClick = (event) => {
    // Prevent event propagation to the parent elements
    event.stopPropagation();
  };

  const handleHeaderCheckboxChange = (index) => (event) => {
    event.stopPropagation();
    const newData = [...data];
    const isChecked = event.target.checked;

    // Update the header checkbox status in state
    const record = newData[index];
    record.checked = isChecked;
    setData((prevStatus) => ({ ...prevStatus, record }));

    // Update all the checkboxes inside the panel based on the header checkbox status
    newData[index].content.forEach((item) => {
      item.checked = isChecked;
    });

    setData(newData);
  };

  // Panel Check Status Handling
  const handleAccordionChange = (index, contentIndex) => (event) => {
    const newData = [...data];
    newData[index].content[contentIndex].checked = event.target.checked;
    const allChecked = newData[index].content.filter((perm) => perm.checked).length;
    const allUnChecked = newData[index].content.filter((perm) => !perm.checked).length;
    if (allChecked === newData[index].content.length) {
      newData[index].checked = true;
    } else if (allUnChecked) {
      newData[index].checked = false;
    }
    setData(newData);
  };

  const handleDescriptionShow = (content) => (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setPopupContent(content);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setTimeout(() => {
      setPopupContent('');
    }, 500);
  };

  return (
    <>
      {data.map((item, index) => (
        <Fragment key={`key-${item.id}`}>
          <Accordion sx={{ border: '1px solid #ddd', marginBottom: '12px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panal${item.id}-content`}
              id={`panel${item.id}-header`}
              sx={{ height: '0px', minHeight: '50px !important' }}
            >
              <Typography sx={{ flexShrink: 0 }} component="div" onClick={handleHeaderCheckboxClick}>
                {enableCheckboxes && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        aria-label={`Category Checkbox ${index}`}
                        checked={item.checked || false} // Reflect the header checkbox state
                        onChange={handleHeaderCheckboxChange(index)}
                        onClick={handleHeaderCheckboxClick}
                        indeterminate={
                          item.content.filter((perm) => perm.checked).length !== item.content.length &&
                          item.content.filter((perm) => perm.checked).length !== 0
                        }
                      />
                    }
                    label={item.title}
                  />
                )}
                {!enableCheckboxes && <Box>{item.title}</Box>}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ marginLeft: '20px', display: 'flex', flexDirection: 'column' }} component="div">
                {item.content.map((contentItem, contentIndex) => {
                  return enableCheckboxes ? (
                    <FormControlLabel
                      key={`key-${contentItem.id}`}
                      itemType=""
                      control={
                        <Checkbox
                          aria-label={`Permission Checkbox ${contentIndex}`}
                          checked={contentItem.checked || false} // Reflect the checkbox state
                          onChange={handleAccordionChange(index, contentIndex)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex' }}>
                          <Box sx={{ display: 'flex', lineHeight: '2em', alignItems: 'center' }}>{contentItem.label}</Box>
                          <IconButton aria-label="show-description" size="small" onClick={handleDescriptionShow(contentItem.description)}>
                            <InfoOutlinedIcon sx={{ color: theme.palette.primary.dark }} />
                          </IconButton>
                        </Box>
                      }
                    />
                  ) : (
                    <Box key={`key-${contentItem.id}`} sx={{ display: 'flex' }}>
                      <Box>{contentItem.label}</Box>
                      <IconButton aria-label="show-description" size="small" onClick={handleDescriptionShow(contentItem.description)}>
                        <PriorityHighIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  );
                })}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Popover
            id={id}
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <Typography sx={{ p: 2 }}>{popupContent}</Typography>
          </Popover>
        </Fragment>
      ))}
    </>
  );
};

export default PermAccordion;

PermAccordion.propTypes = {
  permissions: PropTypes.array,
  enableCheckboxes: PropTypes.bool
};
