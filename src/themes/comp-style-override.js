export default function ComponentStyleOverrides(theme) {
  const bgColor = theme.colors?.paper;
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: '100 !important',
          borderRadius: '58px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          },
          '&.MuiButton-containedSuccess': {
            color: theme.colors?.paper,
            '&:hover': {
              backgroundColor: theme.colors?.successMain
            }
          }
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          '&.MuiPopover-paper-MuiMenu-paper': {
            boxShadow: '0px 1px 18px 1px #BFD5EB !important'
          }
        },
        rounded: {
          // borderRadius: `${theme?.customization?.borderRadius}px`
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.colors?.textDark,
          padding: '24px'
        },
        title: {
          fontSize: '1.125rem'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '0px'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem'
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '24px'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.darkTextPrimary,
          paddingTop: '10px',
          paddingBottom: '10px',
          '&.Mui-selected': {
            color: theme.menuSelected,
            backgroundColor: theme.paper,
            '&:hover': {
              backgroundColor: theme.menuSelectedBack
            },
            '& .MuiListItemIcon-root': {
              color: theme.menuSelected,
              '&:Mui-selected': {
                backgroundColor: theme.darkTextPrimary
              }
            }
          },
          '&:hover': {
            backgroundColor: theme.menuSelectedBack,
            color: theme.menuSelected,
            '& .MuiListItemIcon-root': {
              color: theme.menuSelected
            }
          }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.darkTextPrimary,
          minWidth: '36px'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: theme.textDark
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: theme.textDark,
          '&::placeholder': {
            color: theme.darkTextSecondary,
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          MuiMenuItem: {
            root: {
              background: 'red'
            }
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: bgColor,
          borderRadius: `8px`,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.colors?.grey500
          },
          '&:hover $notchedOutline': {
            borderColor: theme.colors?.primaryLight
          },
          '&.MuiInputBase-multiline': {
            padding: 1
          },
          '&.MuiOutlinedInput-root': {
            // border: '1px solid blue',
            // marginBottom:20,
          }
        },
        input: {
          background: bgColor,
          padding: '15.5px 14px',
          borderRadius: '20px',
          // borderRadius: `${theme?.customization?.borderRadius}px`,
          '&.MuiInputBase-inputSizeSmall': {
            padding: '14px 14px',
            '&.MuiInputBase-inputAdornedStart': {
              paddingLeft: 0
            }
          }
        },
        inputAdornedStart: {
          paddingLeft: 4
        },
        notchedOutline: {
          // borderRadius: `10px`
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: theme.colors?.grey300
          }
        },
        mark: {
          backgroundColor: theme.paper,
          width: '4px'
        },
        valueLabel: {
          color: theme?.colors?.primaryLight
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.divider,
          opacity: 1
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: theme.colors?.primaryDark,
          background: theme.colors?.primary200
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-deletable .MuiChip-deleteIcon': {
            color: 'inherit'
          }
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: theme.paper,
          background: theme.colors?.grey800
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
          '&.Mui-checked': {
            color: theme.colors?.primaryDark
          },
          '&.MuiCheckbox-indeterminate': {
            color: theme.colors?.primaryDark
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.td': {
            backgroundColor: 'none !important'
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          // Controls default (unchecked) color for the thumb
          color: theme.colors?.grey800
        },
        colorPrimary: {
          '&.Mui-checked': {
            // Controls checked color for the thumb
            color: theme.colors?.primaryDark
          }
        },
        track: {
          // Controls default (unchecked) color for the track
          opacity: 1,
          backgroundColor: '#E6E6E6 !important',
          '.Mui-checked.Mui-checked + &': {
            // Controls checked color for the track
            opacity: 1,
            backgroundColor: theme.colors?.grey700
          }
        }
      }
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: theme.colors?.primaryDark
          }
        }
      }
    },
    //center label in text field -small
    MuiInputLabel: {
      styleOverrides: {
        root: {
          padding: '5px 0 0 0',
          color: theme.colors?.dark50
        }
      }
    }
  };
}
